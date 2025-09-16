# Twikoo CDN (with Voice Upload Support)

Twikoo评论系统CDN文件，包含语音上传功能的增强版本。

## 📦 文件说明

### 完整版 - twikoo.all.min.js (626KB)
包含所有功能的完整版本，包括：
- ✅ 基础评论功能
- ✅ 语音上传支持
- ✅ 表情符号
- ✅ 图片上传
- ✅ Markdown支持
- ✅ 数学公式(KaTeX)
- ✅ 代码高亮

### 标准版 - twikoo.min.js (485KB)
精简版本，包含：
- ✅ 基础评论功能
- ✅ 语音上传支持
- ✅ 核心依赖

### 无CSS版 - twikoo.nocss.js (582KB)
不包含CSS的版本，适合需要自定义样式的场景：
- ✅ 基础评论功能
- ✅ 语音上传支持
- ✅ 核心依赖

## 🚀 使用方法

### jsDelivr CDN

```html
<!-- 完整版 -->
<script src="https://cdn.jsdelivr.net/gh/sangxuesheng/twikoo-cdn@latest/twikoo.all.min.js"></script>

<!-- 标准版 -->
<script src="https://cdn.jsdelivr.net/gh/sangxuesheng/twikoo-cdn@latest/twikoo.min.js"></script>

<!-- 无CSS版 -->
<script src="https://cdn.jsdelivr.net/gh/sangxuesheng/twikoo-cdn@latest/twikoo.nocss.js"></script>
```

### Docker搭建
Docker
```
docker run --name twikoo -e TWIKOO_THROTTLE=1000 -p 8080:8080 -v ${PWD}/data:/app/data -d tingwensuojian/twikoo
```

Docker Compose
```
version: '3'
services:
  twikoo:
    image: tingwensuojian/twikoo
    container_name: twikoo
    restart: unless-stopped
    ports:
      - 8080:8080
    environment:
      TWIKOO_THROTTLE: 1000
    volumes:
      - ./data:/app/data
```

### 初始化示例

```html
<div id="tcomment"></div>
<script src="https://cdn.jsdelivr.net/gh/sangxuesheng/twikoo-cdn@latest/twikoo.all.min.js"></script>
<script>
  twikoo.init({
    envId: 'your-env-id',
    el: '#tcomment',
    // 语音上传配置
    enableVoiceUpload: true,
    voiceMaxDuration: 60, // 最大录音时长(秒)
    voiceMaxSize: 5 * 1024 * 1024 // 最大文件大小(5MB)
  })
</script>
```

## 📋 版本信息

- **版本**: v1.0.0
- **构建时间**: 2025-09-15
- **基于**: Twikoo 1.0.0 + 语音上传增强
- **许可证**: MIT

## 🔗 相关链接

- [GitHub仓库](https://github.com/sangxuesheng/twikoo-cdn)
- [Twikoo官方文档](https://twikoo.js.org)
- [npm包](https://www.npmjs.com/package/tingwen-twikoo)

## 🗑️ 用户删除评论功能

现在用户可以删除自己发表的评论，删除规则如下：
- 用户只能删除自己的评论
- 评论发表后5分钟内可以删除
- 超过5分钟的评论需要管理员权限删除
- 删除操作不可恢复

### 删除评论方法

在评论区域，每条评论右侧会有一个删除按钮（仅对评论作者可见），点击删除按钮即可删除评论。

### 管理员删除

管理员可以删除任何评论，不受时间限制。管理员删除需要登录管理后台进行操作。

## 📤 上传到GitHub

本项目提供了多种方式将代码上传到GitHub：

### 方法一：使用上传助手（推荐）

Windows用户可以直接运行以下脚本：

```bash
# 批处理版本
upload_helper.bat

# 或PowerShell版本
powershell -ExecutionPolicy Bypass -File upload_helper.ps1
```

### 方法二：使用Node.js脚本

```bash
# 1. 清理项目并准备上传脚本
node prepare_github_upload.js

# 2. 设置GitHub Token
set GITHUB_TOKEN=your_github_token_here

# 3. 上传文件到GitHub
node upload_to_github.js
```

### 方法三：使用Git命令

```bash
# 1. 初始化Git仓库
git init

# 2. 添加远程仓库
git remote add origin https://github.com/sangxuesheng/twikoo-cdn.git

# 3. 添加文件到暂存区
git add .

# 4. 提交更改
git commit -m "Initial commit: Twikoo CDN with voice upload support"

# 5. 推送到GitHub
git push -u origin main
```

### 详细指南

更详细的上传指南请参考 [GITHUB_UPLOAD_GUIDE.md](GITHUB_UPLOAD_GUIDE.md)。

## 📦 项目结构

```
.
├── .github/                 # GitHub Actions 工作流
├── dist/                   # 构建产物
├── src/                    # 源代码
├── docs/                   # 文档
├── demo/                   # 示例
├── clean_project.js        # 项目清理脚本
├── prepare_github_upload.js # GitHub 上传准备脚本
├── upload_to_github.js     # GitHub 上传脚本
├── upload_helper.bat       # Windows 上传助手（批处理）
├── upload_helper.ps1       # Windows 上传助手（PowerShell）
└── GITHUB_UPLOAD_GUIDE.md  # GitHub 上传指南
```
