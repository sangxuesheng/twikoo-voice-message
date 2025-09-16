# Twikoo CDN GitHub 上传助手 (PowerShell版本)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Twikoo CDN GitHub 上传助手" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了Git
try {
    $gitVersion = git --version 2>$null
    if (-not $gitVersion) {
        throw "Git not found"
    }
} catch {
    Write-Host "错误: 未检测到 Git，请先安装 Git。" -ForegroundColor Red
    Write-Host "下载地址: https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "按任意键退出"
    exit 1
}

# 检查是否设置了GitHub Token
if (-not $env:GITHUB_TOKEN) {
    Write-Host "警告: 未设置 GITHUB_TOKEN 环境变量。" -ForegroundColor Yellow
    Write-Host "请运行以下命令设置您的GitHub Token:" -ForegroundColor Yellow
    Write-Host "`$env:GITHUB_TOKEN = 'your_github_token_here'" -ForegroundColor Yellow
    Write-Host ""
    $token = Read-Host "请输入您的GitHub Token"
    $env:GITHUB_TOKEN = $token
}

Write-Host ""
Write-Host "选择上传方式:" -ForegroundColor Green
Write-Host "1. 使用脚本上传 (推荐)" -ForegroundColor Green
Write-Host "2. 使用Git命令上传" -ForegroundColor Green
Write-Host ""
$choice = Read-Host "请选择 (1/2)"

if ($choice -eq "1") {
    # 使用脚本上传
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "使用脚本上传" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    # 检查Node.js是否安装
    try {
        $nodeVersion = node --version 2>$null
        if (-not $nodeVersion) {
            throw "Node.js not found"
        }
    } catch {
        Write-Host "错误: 未检测到 Node.js，请先安装 Node.js。" -ForegroundColor Red
        Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "按任意键退出"
        exit 1
    }

    Write-Host "正在准备上传..." -ForegroundColor Yellow
    node prepare_github_upload.js

    Write-Host ""
    Write-Host "准备完成，开始上传..." -ForegroundColor Yellow
    node upload_to_github.js

    Write-Host ""
    Write-Host "上传完成！" -ForegroundColor Green
    Read-Host "按任意键退出"
    exit 0
} elseif ($choice -eq "2") {
    # 使用Git命令上传
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "使用Git命令上传" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    # 检查是否已初始化Git仓库
    if (-not (Test-Path ".git")) {
        Write-Host "初始化Git仓库..." -ForegroundColor Yellow
        git init
        Write-Host ""
    }

    # 检查是否已添加远程仓库
    $remotes = git remote -v
    if ($remotes -notmatch "origin") {
        Write-Host "添加远程仓库..." -ForegroundColor Yellow
        git remote add origin https://github.com/sangxuesheng/twikoo-cdn.git
        Write-Host ""
    }

    Write-Host "添加文件到暂存区..." -ForegroundColor Yellow
    git add .

    Write-Host ""
    $commitMsg = Read-Host "请输入提交信息 (默认: 'Initial commit: Twikoo CDN with voice upload support')"
    if (-not $commitMsg) {
        $commitMsg = "Initial commit: Twikoo CDN with voice upload support"
    }

    Write-Host "提交更改..." -ForegroundColor Yellow
    git commit -m $commitMsg

    Write-Host ""
    Write-Host "推送到GitHub..." -ForegroundColor Yellow
    git push -u origin main

    Write-Host ""
    Write-Host "上传完成！" -ForegroundColor Green
    Read-Host "按任意键退出"
    exit 0
} else {
    Write-Host "无效选择，请重新运行脚本。" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}