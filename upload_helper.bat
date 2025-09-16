@echo off
echo ========================================
echo Twikoo CDN GitHub 上传助手
echo ========================================
echo.

REM 检查是否安装了Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到 Git，请先安装 Git。
    echo 下载地址: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

REM 检查是否设置了GitHub Token
if "%GITHUB_TOKEN%"=="" (
    echo 警告: 未设置 GITHUB_TOKEN 环境变量。
    echo 请运行以下命令设置您的GitHub Token:
    echo set GITHUB_TOKEN=your_github_token_here
    echo.
    set /p GITHUB_TOKEN_INPUT=请输入您的GitHub Token: 
    set GITHUB_TOKEN=%GITHUB_TOKEN_INPUT%
)

echo.
echo 选择上传方式:
echo 1. 使用脚本上传 (推荐)
echo 2. 使用Git命令上传
echo.
set /p CHOICE=请选择 (1/2): 

if "%CHOICE%"=="1" goto SCRIPT_UPLOAD
if "%CHOICE%"=="2" goto GIT_UPLOAD
echo 无效选择，请重新运行脚本。
pause
exit /b 1

:SCRIPT_UPLOAD
echo.
echo ========================================
echo 使用脚本上传
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到 Node.js，请先安装 Node.js。
    echo 下载地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo 正在准备上传...
node prepare_github_upload.js

echo.
echo 准备完成，开始上传...
node upload_to_github.js

echo.
echo 上传完成！
pause
exit /b 0

:GIT_UPLOAD
echo.
echo ========================================
echo 使用Git命令上传
echo ========================================
echo.

REM 检查是否已初始化Git仓库
if not exist ".git" (
    echo 初始化Git仓库...
    git init
    echo.
)

REM 检查是否已添加远程仓库
git remote -v | findstr "origin" >nul
if %errorlevel% neq 0 (
    echo 添加远程仓库...
    git remote add origin https://github.com/sangxuesheng/twikoo-cdn.git
    echo.
)

echo 添加文件到暂存区...
git add .

echo.
set /p COMMIT_MSG=请输入提交信息 (默认: "Initial commit: Twikoo CDN with voice upload support"): 
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Initial commit: Twikoo CDN with voice upload support

echo 提交更改...
git commit -m "%COMMIT_MSG%"

echo.
echo 推送到GitHub...
git push -u origin main

echo.
echo 上传完成！
pause
exit /b 0