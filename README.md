# AI声音克隆系统

## 项目简介

AI声音克隆系统是一个基于Web技术开发的声音克隆应用，允许用户选择声音模型、输入文本并生成自然流畅的克隆语音。该系统采用现代化的前端技术，提供直观易用的用户界面，支持与GPT-SoVITS-v2pro API服务进行无缝集成。

## ✨ 功能特性

- **🔊 声音克隆**：输入文本，生成自然流畅的克隆语音
- **📁 模型管理**：从指定目录加载和管理声音模型
- **🎵 音频播放**：实时播放生成的音频文件
- **🌐 跨域支持**：内置代理服务，解决浏览器跨域限制
- **📱 响应式设计**：适配不同屏幕尺寸的设备
- **⚡ 快速部署**：支持本地快速启动和部署

## 🚀 快速开始

### 环境要求

- Python 3.x 或 Node.js 14+
- 现代浏览器（Chrome、Firefox、Safari等）
- 已部署的 GPT-SoVITS-v2pro API 服务

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/lhgkk66/gz-jkyy-video.git
cd gz-jkyy-video/capture-creators-main

# 2. 启动本地服务器（方法一：Python）
python -m http.server 8000

# 或使用 Node.js（方法二）
npx http-server -p 8000

# 3. 访问应用
# 打开浏览器访问 http://localhost:8000
```

### 启动代理服务（可选）

如果遇到跨域问题，可以启动代理服务：

```bash
# 启动 Python 代理服务器
python proxy.py
```

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端 | HTML5 | - |
| 前端 | CSS3 | - |
| 前端 | JavaScript (ES6+) | - |
| 开发工具 | Python | 3.x |
| 开发工具 | Node.js | 14+ |
| API服务 | GPT-SoVITS-v2pro | - |

## 📁 项目结构

```
capture-creators-main/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js              # 核心JavaScript逻辑
├── proxy.js            # JavaScript代理（前端）
├── proxy.py            # Python代理服务
├── test.py             # 测试脚本
├── outputs/            # 音频输出目录
└── README.md           # 项目说明
```

## 📖 使用指南

### 1. 模型选择

1. 在左侧导航栏点击"声音克隆"
2. 点击"选择模型文件夹"按钮
3. 选择模型目录（默认：`D:\1\ai study\GPT-SoVITS-v2pro-20250604\GPT_weights_v2Pro`）
4. 从下拉列表中选择一个声音模型

### 2. 语音合成

1. 在文本输入框中输入需要合成的文本
2. 点击"开始合成"按钮
3. 等待语音生成完成
4. 点击播放按钮听取生成的语音

### 3. 声音库管理

1. 在左侧导航栏点击"声音库"
2. 点击"选择音频文件"按钮上传音频样本
3. 点击"模型训练"按钮开始训练新模型

## ⚙️ 配置选项

### 环境变量

在 `app.js` 中可以配置以下参数：

| 参数名 | 说明 | 默认值 |
|--------|------|--------|
| `API_BASE_URL` | GPT-SoVITS API 基础地址 | `http://localhost:9880` |
| `DEFAULT_MODEL_PATH` | 默认模型路径 | `D:\1\ai study\GPT-SoVITS-v2pro-20250604\GPT_weights_v2Pro` |
| `TEXT_MAX_LENGTH` | 文本最大长度限制 | 500 |

### 代理配置

在 `proxy.py` 中可以配置代理服务参数：

| 参数名 | 说明 | 默认值 |
|--------|------|--------|
| `TARGET_API` | 目标API地址 | `http://localhost:9880` |
| `PORT` | 代理服务端口 | 8080 |

## 🧪 测试

### 运行测试脚本

```bash
# 使用测试脚本生成语音
python test.py "这是一个测试文本"
```

### 浏览器测试

1. 打开浏览器开发者工具
2. 切换到控制台选项卡
3. 观察API调用日志和错误信息
4. 检查网络请求状态和响应数据

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目地址：[https://github.com/lhgkk66/gz-jkyy-video](https://github.com/lhgkk66/gz-jkyy-video)
- 邮箱：2966218931@qq.com

## 📝 更新日志

### v1.0.0 (2026-01-05)

- ✅ 初始版本发布
- ✅ 实现声音克隆核心功能
- ✅ 支持模型选择和管理
- ✅ 集成API代理服务
- ✅ 提供测试脚本

## 🎯 未来规划

- [ ] 支持批量文本合成
- [ ] 添加音频下载功能
- [ ] 实现模型上传和分享
- [ ] 支持多语言合成
- [ ] 优化用户界面设计
- [ ] 添加实时预览功能

---

**如果这个项目对您有帮助，请给它一个 ⭐ 支持！**