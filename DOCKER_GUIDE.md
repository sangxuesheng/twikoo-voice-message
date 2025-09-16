# Twikoo Docker 容器使用指南

本指南将帮助您使用Docker运行Twikoo评论系统，并连接到MongoDB数据库。

## 🚀 快速开始

### 1. 启动Twikoo容器

双击运行 `start-twikoo.bat` 脚本，该脚本将：
- 停止任何正在运行的Twikoo容器
- 启动新的Twikoo容器并连接到MongoDB数据库
- 显示访问地址和连接信息

### 2. 访问Twikoo

在浏览器中访问：http://localhost:8080

### 3. 停止Twikoo容器

双击运行 `stop-twikoo.bat` 脚本，该脚本将停止Twikoo容器。

### 4. 查看容器日志

双击运行 `view-logs.bat` 脚本，该脚本将显示Twikoo容器的实时日志。

## ⚙️ 配置说明

### Docker Compose 配置

`docker-compose.yml` 文件已配置为连接到您的MongoDB数据库：

```yaml
version: '3.8'

services:
  twikoo:
    image: tingwensuojian/twikoo:latest
    container_name: twikoo
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - TWIKOO_DATA_PATH=/app/data
      - MONGODB_URI=mongodb+srv://Twikoo:jR6t6vKR70WpKaPI@cluster0.difoec4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    restart: unless-stopped
    networks:
      - twikoo-network

networks:
  twikoo-network:
    driver: bridge
```

### 环境变量说明

- `NODE_ENV=production`: 设置为生产环境
- `TWIKOO_DATA_PATH=/app/data`: 设置数据存储路径
- `MONGODB_URI`: MongoDB连接字符串，已配置为您的MongoDB Atlas集群

## 📝 使用说明

### 初始化Twikoo

1. 访问 http://localhost:8080
2. 点击"登录"按钮
3. 使用管理员账号登录（首次使用需要注册）
4. 在管理界面中配置您的Twikoo

### 前端集成

在您的网站中添加以下代码：

```html
<div id="tcomment"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js"></script>
<script>
  twikoo.init({
    envId: 'http://localhost:8080', // 您的Twikoo服务地址
    el: '#tcomment',
    // 语音上传配置
    enableVoiceUpload: true,
    voiceMaxDuration: 60, // 最大录音时长(秒)
    voiceMaxSize: 5 * 1024 * 1024 // 最大文件大小(5MB)
  })
</script>
```

## 🔧 故障排除

### 容器无法启动

1. 检查Docker是否正在运行
2. 运行 `docker-compose logs` 查看错误信息
3. 确保端口8080未被其他程序占用

### 无法连接到MongoDB

1. 检查MongoDB连接字符串是否正确
2. 确保MongoDB Atlas集群允许您的IP地址访问
3. 检查网络连接是否正常

### 其他问题

1. 查看容器日志：运行 `view-logs.bat`
2. 重启容器：运行 `stop-twikoo.bat` 然后 `start-twikoo.bat`
3. 检查Docker和Docker Compose是否正确安装

## 📚 更多信息

- [Twikoo官方文档](https://twikoo.js.org/)
- [Docker Compose官方文档](https://docs.docker.com/compose/)
- [MongoDB Atlas官方文档](https://docs.atlas.mongodb.com/)