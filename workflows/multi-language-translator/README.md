# 🌍 Multi-Language Translator

> 基于 n8n 和 Google Gemini CLI 构建的智能多语言翻译服务，支持实时翻译与结构化响应

📖 **[完整教程](https://rvfdqgohv5q.feishu.cn/wiki/QRr1wJtfRiOTOnkUf9HcqRsNnrg)** | 🎯 **技术栈**: n8n + Google Gemini CLI + Webhook

## 🚀 快速开始

### 📦 服务功能

| 功能模块 | 说明 | 特点 | 使用场景 |
|----------|------|------|----------|
| **Webhook 接口** | RESTful API 服务 | POST 请求、JSON 响应 | 外部系统集成、应用调用 |
| **智能翻译** | AI 驱动的翻译引擎 | 语义理解、上下文感知 | 文档翻译、实时对话 |
| **多语言支持** | 6种主流语言互译 | 批量翻译、格式保持 | 国际化应用、内容本地化 |

### 📥 工作流文件

- `smart-translation-api.json` - 智能翻译API服务

## ✨ 核心特性

- 🤖 **AI 智能翻译**: 基于 Google Gemini CLI，准确理解语义和上下文
- 🌐 **多语言支持**: 支持中文、英语、日语、韩语、法语、德语互译
- 📡 **RESTful API**: 标准化接口设计，易于集成各种应用
- 🔄 **批量翻译**: 一次请求支持多种目标语言同时翻译
- 📊 **结构化响应**: JSON 格式返回，包含详细的翻译信息和元数据

## 🛠 依赖工具

- [Gemini CLI](https://github.com/replit/gemini-cli) - 本地 API 代理服务
- n8n Webhook - API 接口服务
- Google Cloud Project - 项目配置

## 🎬 API 使用示例

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gemini-2.5-flash",
        "messages": [{"role": "user", "content": "你好，今天天气怎么样？"}] 
    }'
```

### 请求示例
```bash
curl -X POST http://localhost:5678/webhook/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you today?",
    "target_languages": ["中文", "日语", "法语"]
  }'
```

### 响应示例
```json
{
  "success": true,
  "original_text": "Hello, how are you today?",
  "requested_languages": ["Chinese", "Japanese", "French"],
  "translations": {
    "Chinese": "你好，你今天怎么样？",
    "Japanese": "こんにちは、今日はいかがですか？",
    "French": "Bonjour, comment allez-vous aujourd'hui ?"
  },
  "extracted_count": 3,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "model_used": "gemini-2.5-pro",
  "request_id": "req_123456789"
}
```

## 🔧 部署配置

### 1. 环境准备
```bash
# 启动 n8n
docker volume create n8n_data

docker run -it --rm \
    --name n8n \
    -p 5678:5678 \
    -e GENERIC_TIMEZONE=Asia/Shanghai \
    -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
    -v n8n_data:/home/node/.n8n \
    docker.n8n.io/n8nio/n8n:1.99.1

# 安装 Gemini CLI
npm install -g @replit/gemini-cli

# 启动 Gemini CLI API
pip install fastapi uvicorn
python main.py
```

### 2. 工作流配置
1. 导入 `smart-translation-api.json` 工作流
2. 配置 Google Cloud Project ID
3. 确保 Gemini CLI 服务运行在 `http://localhost:8000`
4. 激活工作流，获取 Webhook URL

### 3. 支持语言
- **中文** (Chinese)
- **英语** (English) 
- **日语** (Japanese)
- **韩语** (Korean)
- **法语** (French)
- **德语** (German)
---

*打破语言壁垒，让沟通无界限！基于 AI 的智能翻译，让每个词汇都精准到位。*