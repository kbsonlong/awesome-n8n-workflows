# Xiaobot Article Harvester

📖 **[完整教程](https://rvfdqgohv5q.feishu.cn/wiki/Tdnbw1ckRiyhZikyotjcRB8bnSe)** 一个基于 n8n 和 Crawl4AI 的小报童文章自动采集工具，支持批量下载专栏文章并转换为 Markdown 格式。

## 📋 基本信息

- **工作流名称**: Xiaobot Article Harvester
- **版本**: v1.0.0
- **创建者**: LQ
- **微信**: cloud-native-101
- **公众号**: 林月半子的AI笔记

## 🎯 功能概述

这个工作流实现了从小报童(Xiaobot)平台自动批量下载文章内容并转换为 Markdown 格式文件的完整流程。通过模拟浏览器行为**绕过动态 API 签名限制**，实现全自动化的文章采集与格式转换。

### 核心特性

- **智能绕过限制**: 通过 Crawl4AI 模拟浏览器行为，绕过小报童的动态 API 签名验证
- **自动化采集**: 支持无限滚动加载，确保获取专栏内所有文章
- **格式转换**: 自动将 HTML 内容转换为标准 Markdown 格式
- **批量处理**: 一键处理整个专栏的所有文章
- **文件管理**: 智能文件命名，按发布日期和标题组织

## 🏗️ 工作流架构

```
手动触发 → 配置参数 → Crawl4AI采集 → 数据验证 → 拆分文章列表
                                                    ↓
保存文件 ← 处理文件信息 ← HTML转Markdown ← 循环处理 ← 文章数组
```

### 核心节点说明

1. **配置专栏参数**: 设置目标专栏 URL 和认证信息
2. **Crawl4AI获取数据**: 模拟浏览器访问并拦截 API 响应
3. **拆分文章列表**: 将批量数据拆分为单个文章项
4. **HTML转Markdown**: 将文章内容转换为 Markdown 格式
5. **保存文件**: 将处理后的文章保存为本地文件

## ⚙️ 配置说明

### 必需配置项

在 `配置专栏参数` 节点中修改以下参数：

```javascript
{
  "crawl4ai_server": "http://host.docker.internal:11235/crawl",
  "target_url": "https://www.xiaobot.net/p/<YOUR_COLUMN_ID>",
  "xiaobot_authorization": "<YOUR_XIAOBOT_TOKEN_HERE>"
}
```

#### 参数详解

- **crawl4ai_server**: Crawl4AI 服务地址，默认本地部署
- **target_url**: 小报童专栏地址，替换 `<YOUR_COLUMN_ID>` 为实际专栏ID
- **xiaobot_authorization**: 小报童认证令牌，需要从浏览器开发者工具获取

### 认证信息获取

获取步骤：
1. 登录小报童网站
2. 打开浏览器开发者工具 (F12)
3. 在 Network 标签页中找到任意 API 请求
4. 复制 Authorization 请求头的值

## 🔧 技术实现

### Crawl4AI 配置

工作流使用 JavaScript 代码来拦截小报童的 API 响应：

```javascript
// 拦截 XMLHttpRequest
window.XMLHttpRequest = function() {
  const xhr = new originalXHR();
  // 监听 api.xiaobot.net 请求
  if (this._url && this._url.includes('api.xiaobot.net')) {
    // 收集响应数据到 window.apiData
  }
  return xhr;
};

// 模拟滚动加载
for(let i=0; i<50; i++) {
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise(resolve => setTimeout(resolve, 5000));
}
```

### 文件命名规则

生成的 Markdown 文件遵循以下命名规则：

```
{发布日期}_{安全文件名}.md
```

- 发布日期格式: `YYYY-MM-DD`
- 文件名清理: 移除特殊字符，限制长度为80字符
- 保存路径: `/tmp/` 目录

## 📦 依赖环境

### 必需服务

1. **n8n**: 工作流编排平台 (v1.94.1+)
2. **Crawl4AI**: 智能网页抓取服务
3. **Docker**: 容器化部署

## 🚀 使用指南

### 1. 环境准备

```bash
# 启动 n8n
docker volume create n8n_data

docker run -it --rm \
    --name n8n \
    -p 5678:5678 \
    -e GENERIC_TIMEZONE=Asia/Shanghai \
    -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
    -v $(pwd)/xiaobot:/tmp \
    -v n8n_data:/home/node/.n8n \
    docker.n8n.io/n8nio/n8n:1.100.1


# 启动 Crawl4AI
docker run -d \
    --name crawl4ai \
    -p 11235:11235 \
    --shm-size=3g \
    unclecode/crawl4ai:0.7.0-r1
```

### 2. 导入工作流

1. 打开 n8n 界面: `http://localhost:5678`
2. 导入 `xiaobot-article-harvester.json`
3. 配置必要的认证信息

### 3. 配置参数

在 `配置专栏参数` 节点中设置：
- 目标专栏 URL
- 小报童认证令牌

### 4. 执行工作流

点击 "Execute workflow" 开始采集，工作流将：
1. 访问指定专栏页面
2. 拦截并收集所有文章数据
3. 转换内容格式
4. 保存为 Markdown 文件

## 📊 输出结果

### 文件结构

```
/tmp/
├── 2024-01-15_小报童文章标题1.md
├── 2024-01-16_小报童文章标题2.md
└── ...
```

### Markdown 格式

每个生成的 Markdown 文件包含：
- 完整的文章内容
- 正确的格式转换
- 保留原始的文本结构

## 🔍 故障排除

### 常见问题

1. **认证失败**: 检查 Authorization token 是否正确且未过期
2. **无法访问**: 确认 Crawl4AI 服务正常运行
3. **文章数量为0**: 检查专栏 URL 是否正确
4. **转换失败**: 确认 HTML 内容格式是否符合预期

### 调试建议

- 检查 Crawl4AI 服务状态: `curl http://localhost:11235/health`
- 验证专栏访问权限
- 查看 n8n 执行日志获取详细错误信息

## 🏆 工作流优势

1. **自动化程度高**: 一键完成从访问到保存的全流程
2. **绕过技术限制**: 巧妙解决动态 API 签名问题
3. **数据完整性**: 通过无限滚动获取所有文章
4. **格式规范**: 标准 Markdown 输出，便于后续处理
5. **扩展性强**: 可轻松修改以支持其他类似平台

## 📄 许可证

本工作流仅供学习和个人使用，请遵守小报童平台的使用条款。

---

> **注意**: 使用本工作流时请确保遵守相关平台的服务条款和法律法规。