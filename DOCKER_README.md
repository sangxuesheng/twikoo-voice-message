# Twikoo with Voice Upload Support

[![Docker Pulls](https://img.shields.io/docker/pulls/tingwensuojian/twikoo.svg)](https://hub.docker.com/r/tingwensuojian/twikoo)
[![Docker Stars](https://img.shields.io/docker/stars/tingwensuojian/twikoo.svg)](https://hub.docker.com/r/tingwensuojian/twikoo)
[![Image Size](https://img.shields.io/docker/image-size/tingwensuojian/twikoo.svg)](https://hub.docker.com/r/tingwensuojian/twikoo)

一个支持语音上传的Twikoo评论系统Docker镜像，基于原版Twikoo1.6.44增强，添加了语音留言功能。

## 🌟 功能特点

- ✅ 基础评论功能
- ✅ 语音上传支持
- ✅ 表情符号
- ✅ 图片上传
- ✅ Markdown支持
- ✅ 数学公式(KaTeX)
- ✅ 代码高亮
- ✅ 用户删除评论功能
- ✅ 响应式设计
- ✅ 暗黑模式支持

## 🚀 快速开始

### 使用Docker运行

```bash
docker run --name twikoo -e TWIKOO_THROTTLE=1000 -p 8080:8080 -v ${PWD}/data:/app/data -d tingwensuojian/twikoo
```

### 使用Docker Compose

```yaml
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

## 📝 配置说明

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `TWIKOO_THROTTLE` | 1000 | API请求频率限制 |
| `TWIKOO_ENV` | - | 环境ID |
| `TWIKOO_MONGODB` | - | MongoDB连接字符串 |
| `TWIKOO_IP` | - | 服务端IP |
| `TWIKOO_PORT` | 8080 | 服务端端口 |

### 语音上传配置

```html
<div id="tcomment"></div>
<script src="https://cdn.jsdelivr.net/gh/sangxuesheng/twikoo-cdn@main/twikoo.all.min.js"></script>
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
- [Docker Hub仓库](https://hub.docker.com/r/tingwensuojian/twikoo)
- [CDN文件仓库](https://github.com/sangxuesheng/twikoo-cdn)

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

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。