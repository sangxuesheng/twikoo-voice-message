# GitHub 上传指南

本指南说明如何将 Twikoo CDN（带语音上传功能）项目清理并上传到 GitHub。

## 📋 准备工作

1. 确保已安装 Node.js
2. 确保已安装 Git
3. 准备好 GitHub 个人访问令牌（Personal Access Token）

## 🚀 上传步骤

### 方法一：使用脚本上传

1. **清理项目并准备上传脚本**
   ```bash
   node prepare_github_upload.js
   ```

2. **设置 GitHub Token 环境变量**
   ```bash
   # Windows
   set GITHUB_TOKEN=your_github_token_here
   
   # Linux/Mac
   export GITHUB_TOKEN=your_github_token_here
   ```

3. **上传文件到 GitHub**
   ```bash
   node upload_to_github.js
   ```

### 方法二：使用 Git 命令上传

1. **初始化 Git 仓库（如果尚未初始化）**
   ```bash
   git init
   ```

2. **添加远程仓库**
   ```bash
   git remote add origin https://github.com/sangxuesheng/twikoo-cdn.git
   ```

3. **添加所有文件到暂存区**
   ```bash
   git add .
   ```

4. **提交更改**
   ```bash
   git commit -m "Initial commit: Twikoo CDN with voice upload support"
   ```

5. **推送到 GitHub**
   ```bash
   git push -u origin main
   ```

## 📁 项目结构

清理后的项目包含以下主要文件和目录：

```
.
├── .github/                 # GitHub Actions 工作流
├── .gitignore              # Git 忽略文件
├── .npmignore              # npm 忽略文件
├── babel.config.json       # Babel 配置
├── clean_project.js        # 项目清理脚本
├── dist/                   # 构建产物
│   ├── twikoo.all.min.js   # 完整版
│   ├── twikoo.min.js       # 标准版
│   ├── twikoo.nocss.js     # 无CSS版
│   └── twikoo.css          # CSS文件
├── docs/                   # 文档
├── Dockerfile              # Docker 配置
├── docker-compose.yml      # Docker Compose 配置
├── LICENSE                 # 许可证
├── package.json            # 项目配置
├── package-lock.json       # 依赖锁定文件
├── prepare_github_upload.js # GitHub 上传准备脚本
├── README.md               # 项目说明
├── src/                    # 源代码
├── upload_to_github.js     # GitHub 上传脚本
└── webpack.config.js       # Webpack 配置
```

## 🔧 脚本说明

### clean_project.js

用于清理不必要的开发文件，包括：
- 开发工具生成的文件（.idea 目录等）
- 临时文件和日志文件
- 数据库文件
- 构建产物（除了 dist 目录下的文件）
- 锁文件（除了 package-lock.json）

### prepare_github_upload.js

准备上传到 GitHub 的脚本，它会：
1. 调用 clean_project.js 清理项目
2. 创建 upload_to_github.js 脚本
3. 检查必要文件是否存在

### upload_to_github.js

上传文件到 GitHub 的脚本，它会：
1. 递归获取所有需要上传的文件
2. 获取每个文件的 SHA（如果已存在）
3. 上传文件到 GitHub 仓库

## 📝 注意事项

1. **GitHub Token 权限**：确保您的 GitHub Token 具有 `repo` 权限
2. **仓库存在性**：确保目标仓库已存在，或者您有权限创建新仓库
3. **网络连接**：上传过程需要稳定的网络连接
4. **文件大小**：GitHub 对单个文件大小有限制（通常为 100MB）
5. **分支名称**：脚本默认使用 `main` 分支，如果您的仓库使用 `master` 分支，请修改脚本中的 `branch` 配置

## 🚨 故障排除

### 上传失败

如果上传失败，请检查：
1. GitHub Token 是否正确
2. 网络连接是否正常
3. 仓库是否存在
4. 文件路径是否正确

### 文件过大

如果文件过大，请考虑：
1. 使用 Git LFS（Large File Storage）
2. 将大文件存储在其他位置（如 CDN）
3. 压缩文件

### 权限问题

如果遇到权限问题，请检查：
1. GitHub Token 是否具有足够的权限
2. 您是否是仓库的所有者或协作者
3. 仓库是否设置为私有（需要相应权限）

## 📞 支持

如果遇到问题，请：
1. 检查脚本输出中的错误信息
2. 查看 GitHub API 文档
3. 联系项目维护者

---

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。