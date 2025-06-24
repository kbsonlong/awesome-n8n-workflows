# 🧠 RAG 个人知识库 AI 助手

> 基于 n8n 构建的本地化 RAG 系统，让 AI 从"胡说八道"到"有理有据"

📖 **[完整教程](https://rvfdqgohv5q.feishu.cn/wiki/UUFcw8fJ5iNhTektMWacdtoUnlc)** | 🎯 **技术栈**: n8n + Ollama + Qwen3-Embedding + Vector Store

## 🚀 快速开始

### 📦 工作流选择

| 工作流 | 功能 | 特点 | 使用场景 |
|--------|------|------|----------|
| **文档处理流** | 构建知识库 | 智能分割、向量化存储 | 上传文档、建立知识库 |
| **智能问答流** | AI 对话问答 | 语义检索、准确回答 | 查询知识、获取答案 |
| **Telegram 集成流** | 即时通讯对接 | 实时交互、便捷访问 | 移动端使用、团队协作 |

### 📥 工作流文件

- `rag-knowledge-assistant` - RAG 工作流

## ✨ 核心特性

- 🔒 **完全本地化**: 数据不出本地，保护隐私安全
- 🎯 **消除 AI 幻觉**: 基于真实文档回答，杜绝胡编乱造
- 📚 **多格式支持**: PDF、Word、TXT 等文档格式一键处理
- 🔍 **语义检索**: 智能理解问题意图，精准匹配相关内容
- ⚡ **实时更新**: 新增文档立即可用，知识库持续进化
- 💬 **多端接入**: 支持网站嵌入、Telegram 机器人等多种使用方式

## 🛠 依赖工具

- [Ollama](https://ollama.ai/) - 本地 LLM 服务
- [Qwen3-Embedding](https://huggingface.co/Qwen/Qwen3-Embedding-4B-GGUF) - 文本向量化模型
- n8n Vector Store - 向量数据库
- Docker - 容器化部署

## 🎬 效果预览


---

*让 AI 不再"一本正经地胡说八道"，基于真实文档的智能问答才是未来！*