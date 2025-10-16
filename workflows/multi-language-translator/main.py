#!/usr/bin/env python3
"""
Gemini CLI API 包装服务器
一个简单的API服务器，用来包装Gemini CLI调用
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import uuid
import datetime
import logging
import os
from typing import Optional, List
from contextlib import asynccontextmanager
import uvicorn

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 配置优先级设计：请求参数 > 环境变量 > 错误
DEFAULT_PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT', '')

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时执行
    if DEFAULT_PROJECT_ID:
        logger.info(f"✅ 默认Google Cloud项目: {DEFAULT_PROJECT_ID}")
        logger.info("💡 可在请求中使用 project_id 字段覆盖默认值")
    else:
        logger.warning("⚠️  未设置默认GOOGLE_CLOUD_PROJECT")
        logger.info("💡 请在每个请求中传递 project_id，或设置环境变量")
    
    yield  # 这里应用开始运行
    
    # 关闭时执行（可选）
    logger.info("🔻 Gemini CLI API 服务器关闭")

app = FastAPI(
    title="Gemini CLI API", 
    description="包装Gemini CLI的简单API服务",
    lifespan=lifespan
)

# OpenAI兼容的数据模型
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: Optional[str] = "gemini-2.5-flash"
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000
    project_id: Optional[str] = None  # 可选的项目ID

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[dict]

# 简单的单消息模型（兼容之前的接口）
class SimpleChatRequest(BaseModel):
    message: str
    model: Optional[str] = "gemini-2.5-flash"
    project_id: Optional[str] = None  # 可选的项目ID

class SimpleChatResponse(BaseModel):
    response: str
    status: str
    error: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Gemini CLI API 服务器运行中", "docs": "/docs"}

@app.get("/health")
async def health_check():
    """健康检查"""
    try:
        result = subprocess.run(
            ["gemini", "--help"], 
            capture_output=True, 
            text=True, 
            timeout=5
        )
        if result.returncode == 0:
            return {"status": "healthy", "gemini_cli": "available"}
        else:
            return {"status": "unhealthy", "gemini_cli": "not available"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.get("/config/status")
async def get_config_status():
    """获取当前配置状态"""
    return {
        "default_project_id": DEFAULT_PROJECT_ID,
        "has_default": bool(DEFAULT_PROJECT_ID),
        "design_philosophy": "Stateless API - project_id per request",
        "usage": {
            "with_default": "project_id字段可选，不传则使用环境变量",
            "without_default": "project_id字段必填",
            "override": "请求中的project_id优先级最高"
        },
        "example_request": {
            "model": "gemini-2.5-flash",
            "messages": [{"role": "user", "content": "Hello"}],
            "project_id": "optional-project-id"
        }
    }

def execute_qodercli_command(prompt: str) -> tuple[str, str, int]:
    """执行Gemini CLI命令"""
    try:
        
        # 使用shell命令方式
        shell_command = f'echo "" | qodercli  -p "{prompt}"'
        
        result = subprocess.run(
            shell_command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=60,
            cwd=os.path.expanduser('~')
        )
        
        if result.returncode == 0:
            logger.info("qoder CLI executed successfully.")
            return result.stdout.strip(), result.stderr, result.returncode
        else:
            logger.error(f"qoder CLI failed: {result.stderr}")
            return "", result.stderr, result.returncode
        
    except subprocess.TimeoutExpired:
        return "", "Command timed out", 1
    except Exception as e:
        return "", str(e), 1


def execute_gemini_command(prompt: str, model: str = "gemini-2.5-flash", project_id: str = None) -> tuple[str, str, int]:
    """执行Gemini CLI命令"""
    try:
        # 项目ID优先级：请求传递 > 环境变量 > 错误
        current_project = project_id or DEFAULT_PROJECT_ID
        
        if not current_project:
            return "", "错误：需要指定project_id。请在请求中传递project_id或设置GOOGLE_CLOUD_PROJECT环境变量", 1
        
        # 设置环境变量
        env = dict(os.environ)
        env.update({
            'GOOGLE_CLOUD_PROJECT': current_project,
            'TERM': 'xterm-256color',
            'HOME': os.path.expanduser('~'),
        })
        
        logger.info(f"Executing gemini CLI with project: {current_project} (source: {'request' if project_id else 'default'})")
        
        # 使用shell命令方式
        shell_command = f'echo "" | gemini -m "{model}" -p "{prompt}"'
        
        result = subprocess.run(
            shell_command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=60,
            env=env,
            cwd=os.path.expanduser('~')
        )
        
        if result.returncode == 0:
            logger.info("Gemini CLI executed successfully.")
            return result.stdout.strip(), result.stderr, result.returncode
        else:
            logger.error(f"Gemini CLI failed: {result.stderr}")
            return "", result.stderr, result.returncode
        
    except subprocess.TimeoutExpired:
        return "", "Command timed out", 1
    except Exception as e:
        return "", str(e), 1

@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    """OpenAI兼容的聊天完成接口"""
    try:
        # 获取最后一条用户消息
        user_messages = [msg for msg in request.messages if msg.role == "user"]
        if not user_messages:
            raise HTTPException(status_code=400, detail="No user message found")
        
        prompt = user_messages[-1].content
        
        # 执行Gemini命令
        # output, error, return_code = execute_gemini_command(prompt, request.model, request.project_id)
        
        # 执行qodercli命令
        output, error, return_code = execute_qodercli_command(prompt)
        
        if return_code != 0:
            raise HTTPException(status_code=500, detail=f"qodercli CLI error: {error}")
        
        # 格式化为OpenAI兼容的响应
        response_payload = {
            "id": str(uuid.uuid4()),
            "object": "chat.completion",
            "created": int(datetime.datetime.now().timestamp()),
            "model": f"gemini-cli-proxy",  # 标识这是来自代理的
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": output
                    },
                    "logprobs": None,
                    "finish_reason": "stop"
                }
            ]
        }
        
        return response_payload
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=SimpleChatResponse)
async def simple_chat(request: SimpleChatRequest):
    """简单的聊天接口（兼容之前的格式）"""
    try:
        # 执行Gemini命令
        #output, error, return_code = execute_gemini_command(request.message, request.model, request.project_id)

        # 执行qodercli命令
        output, error, return_code = execute_qodercli_command(request.message)
        
        if return_code == 0:
            return SimpleChatResponse(
                response=output,
                status="success"
            )
        else:
            return SimpleChatResponse(
                response="",
                status="error",
                error=f"Gemini CLI 错误: {error}"
            )
            
    except Exception as e:
        return SimpleChatResponse(
            response="",
            status="error",
            error=f"服务器错误: {str(e)}"
        )

# 添加CORS支持
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    print("🚀 启动 Gemini CLI API 服务器...")
    print("📖 API 文档: http://localhost:8000/docs")
    print("🔗 健康检查: http://localhost:8000/health")
    print("💬 OpenAI兼容接口: http://localhost:8000/v1/chat/completions")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )