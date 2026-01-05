# Vercel部署方案

## 1. 项目结构分析

当前项目是一个纯前端HTML/CSS/JavaScript项目，主要文件包括：

* `index.html`：主页面

* `app.js`：JavaScript逻辑

* `styles.css`：样式文件

* `proxy.js`：JavaScript代理

* `proxy.py`：Python代理（仅本地开发使用）

* `test.py`：测试脚本（仅本地开发使用）

* `outputs/`：音频输出目录

## 2. Vercel部署完整流程

### 2.1 项目连接

1. **注册/登录Vercel账号**：访问<https://vercel.com注册或登录>
2. **新建项目**：点击"Add New" → "Project"
3. **连接GitHub仓库**：选择"Import Git Repository"，搜索并选择项目仓库 `lhgkk66/gz-jkyy-video`
4. **选择分支**：选择要部署的分支（通常为main）

### 2.2 构建设置配置

Vercel会自动检测项目类型，对于纯静态项目，配置如下：

| 配置项              | 值             | 说明          |
| ---------------- | ------------- | ----------- |
| Framework Preset | `Static HTML` | 静态HTML项目    |
| Build Command    | 留空            | 纯静态项目无需构建命令 |
| Output Directory | 留空            | 输出目录为项目根目录  |
| Install Command  | 留空            | 无依赖需要安装     |

### 2.3 环境变量配置

由于项目使用代理服务，需要配置环境变量：

| 变量名          | 值       | 说明            |
| ------------ | ------- | ------------- |
| `API_URL`    | 实际API地址 | API服务的完整URL   |
| `PROXY_PORT` | 代理端口号   | 代理服务使用的端口（可选） |

### 2.4 部署触发方式

1. **自动部署**：每次推送代码到main分支时自动触发部署
2. **手动部署**：在Vercel控制台点击"Deploy"按钮
3. **预览部署**：为Pull Request自动创建预览部署

## 3. Vercel运行技术原理

### 3.1 部署流程

1. **代码拉取**：Vercel从GitHub拉取最新代码
2. **依赖安装**：根据项目类型安装依赖（本项目无需）
3. **构建处理**：执行构建命令（本项目无需）
4. **资产优化**：自动优化静态资源（压缩CSS/JS、优化图片等）
5. **部署到CDN**：将优化后的资源部署到Vercel全球CDN网络
6. **分配域名**：自动分配`*.vercel.app`域名

### 3.2 服务器与客户端交互机制

1. **请求路由**：Vercel Edge Network处理所有HTTP请求
2. **静态资源服务**：HTML/CSS/JS等静态资源直接从CDN返回
3. **API代理**：使用Vercel的Serverless Functions或Edge Functions替代本地代理
4. **跨域处理**：Vercel自动处理CORS配置

### 3.3 资源加载策略

1. **按需加载**：仅加载当前页面所需资源
2. **并行加载**：CSS和JavaScript并行加载
3. **优先级排序**：HTML → CSS → JavaScript → 其他资源
4. **资源压缩**：自动压缩CSS/JS/图片等静态资源

### 3.4 缓存机制

1. **CDN缓存**：静态资源在全球CDN节点缓存
2. **浏览器缓存**：通过HTTP缓存头控制浏览器缓存
3. **增量部署**：仅部署变更的文件
4. **缓存失效策略**：基于文件内容哈希自动失效

## 4. 代码调整建议

为了在Vercel上正常运行，需要对代码进行以下调整：

1. **移除本地代理依赖**：使用Vercel Edge Functions替代`proxy.py`和`proxy.js`
2. **添加Vercel配置文件**：创建`vercel.json`配置文件
3. **更新API调用逻辑**：使用环境变量配置API地址
4. **移除本地文件操作**：`test.py`等本地脚本仅在开发环境使用

## 5. 预期效果

部署完成后，项目将：

* 拥有全球可访问的域名

* 享受CDN加速，加载速度快

* 自动处理跨域问题

* 支持HTTPS加密

* 自动扩展，无需维护服务器

## 6. 注意事项

1. Vercel不支持Python脚本运行，需要将`proxy.py`和`test.py`的功能迁移到前端或使用Vercel Functions
2. 音频文件应考虑使用云存储服务，避免直接部署到Vercel
3. 定期监控部署状态和性能指标
4. 配置自定义域名以提升品牌形象

