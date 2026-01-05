# API 功能迁移与整合计划

## 1. 项目分析

**源文件**: `D:\1\ai study\GPT-SoVITS-v2pro-20250604\api_v2.py` - 基于 FastAPI 的 Python 后端 API

* **目标项目**: `d:\1\gzjk-dy\dy-video\capture-creators-main` - 简单的 HTML/CSS/JavaScript 前端项目

## 2. 迁移方案

由于技术栈不同，采用**独立服务 + 前端通信**的方案：

1. 将 Python API 作为独立服务运行
2. 前端通过 HTTP 请求与 API 通信
3. 保持 API 功能完整性

## 3. 迁移步骤

### 3.1 创建项目结构

在目标项目中创建 API 相关目录：

```
capture-creators-main/
├── api/                  # API 相关文件
│   ├── api_v2.py         # 迁移的 API 主文件
│   ├── requirements.txt   # 依赖列表
│   └── start_api.py      # API 启动脚本
├── index.html            # 前端主文件
├── app.js                # 前端 JavaScript
└── styles.css            # 前端样式
```

### 3.2 复制 API 文件

* 复制 `api_v2.py` 到 `api/` 目录

* 复制相关依赖项和配置文件

### 3.3 创建依赖文件

创建 `requirements.txt`，包含 API 所需的所有依赖：

```
fastapi
uvicorn
numpy
soundfile
pydantic
```

### 3.4 创建启动脚本

创建 `start_api.py`，简化 API 启动过程：

```python
import subprocess
import sys

# 启动 API 服务
subprocess.run([sys.executable, "api_v2.py", "-a", "127.0.0.1", "-p", "9880"])
```

### 3.5 修改前端代码

更新 `app.js`，添加与 API 通信的功能：

* 添加 API 调用函数

* 修改模型选择逻辑

* 添加音频合成功能

* 处理 API 响应

### 3.6 测试与验证

* 运行 API 服务

* 测试前端与 API 的通信

* 验证所有功能正常工作

## 4. 技术要点

### 4.1 API 配置

* 确保 API 监听本地地址 `127.0.0.1` 和端口 `9880`

* 配置正确的模型路径

### 4.2 前端与 API 通信

* 使用 `fetch` API 或 `XMLHttpRequest` 发送请求

* 处理音频流响应

* 实现错误处理

### 4.3 模型选择与使用

* 前端选择模型后，将模型信息发送给 API

* API 根据选择的模型生成音频

* 前端接收并播放生成的音频

## 5. 预期结果

* API 服务能够独立运行

* 前端能够与 API 正常通信

* 所有 API 功能可用

* 与现有系统组件正确集成

* 符合项目代码规范

## 6. 后续优化

* 添加 API 状态检测

* 实现更好的错误处理

* 添加加载状态指示器

* 优化音频流处理

