# GitHub项目收集器

一键收集GitHub项目信息到飞书表格的完整解决方案。

## 📁 项目结构

```
github-to-feishu-collector/
├── README.md                              # 项目说明
├── setup-instructions.md                  # 详细设置指南
├── github-to-feishu-workflow-api.json     # n8n工作流(API版本) 
└── browser-extension/                     # Chrome浏览器扩展
    ├── manifest.json                      # 扩展配置文件
    ├── popup.html                         # 弹出窗口界面
    ├── popup.js                           # 弹出窗口脚本
    ├── content.js                         # 内容脚本
    ├── icon16.png                         # 16x16图标
    ├── icon48.png                         # 48x48图标
    ├── icon128.png                        # 128x128图标
    └── *.svg                              # 矢量图标文件
```

## 🎯 功能特点

- ✅ **一键收集**: 在GitHub项目页面一键收集项目信息
- ✅ **多种方式**: 支持浏览器扩展使用方式
- ✅ **丰富数据**: 收集项目名称、描述、stars、forks、语言、许可证等信息
- ✅ **自动入库**: 通过n8n工作流自动插入飞书表格
- ✅ **稳定可靠**: 提供API版本，数据获取更稳定
- ✅ **易于使用**: 简单配置，即可使用

## 🚀 快速开始

1. **选择版本**: 使用API版本的工作流脚本
2. **导入工作流**: 将 `github-to-feishu-workflow-api.json` 导入n8n
3. **配置飞书**: 设置飞书表格和API认证
4. **选择工具**: 使用浏览器扩展
5. **开始收集**: 在GitHub项目页面一键收集信息

详细步骤请参考 [设置指南](setup-instructions.md)

## 📝 文件说明

### 核心文件

| 文件 | 说明 | 推荐度 |
|------|------|--------|
| `github-to-feishu-workflow-api.json` | n8n工作流API版本 | ⭐⭐⭐⭐⭐ |
| `browser-extension/` | Chrome浏览器扩展 | ⭐⭐⭐⭐ |


### 文档文件

| 文件 | 说明 |
|------|------|
| `setup-instructions.md` | 详细的设置和使用指南 |

## 🔧 技术架构

```
GitHub项目页面
      ↓
[浏览器扩展/书签脚本]
      ↓
   n8n工作流
      ↓
   GitHub API
      ↓
    飞书表格
```