const fs = require('fs');
const path = require('path');

// 不需要上传到GitHub的文件和目录
const filesToRemove = [
  // 开发工具生成的文件
  '.idea',
  'file_contents.json',
  'github_upload.json',
  'prepare_github_upload.js',
  'read_files.js',
  'save_files.js',
  'temp.txt',
  'twikoo-test.html',
  'twikoo.all.min.js.base64',
  'twikoo.all.min.js.txt',
  'twikoo.css.base64',
  'twikoo.css.txt',
  'twikoo.min.js.base64',
  'twikoo.min.js.txt',
  'twikoo.nocss.js.base64',
  'twikoo.nocss.js.txt',
  'upload_to_github.js',
  'run-docker.bat',
  'start-twikoo.bat',
  
  // 数据库文件
  'data/db.json',
  'data/db.json.0',
  'data/db.json.1',
  'data/db.json.2',
  
  // 构建产物（除了dist目录下的文件）
  'stats.json',
  
  // 锁文件（除了package-lock.json）
  'yarn.lock',
  'pnpm-lock.yaml'
];

// 删除文件或目录的函数
function removeFileOrDirectory(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        // 递归删除目录
        const files = fs.readdirSync(filePath);
        for (const file of files) {
          const fullPath = path.join(filePath, file);
          removeFileOrDirectory(fullPath);
        }
        fs.rmdirSync(filePath);
        console.log(`删除目录: ${filePath}`);
      } else {
        // 删除文件
        fs.unlinkSync(filePath);
        console.log(`删除文件: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`删除 ${filePath} 时出错:`, error.message);
  }
}

// 清理项目
function cleanProject() {
  console.log('开始清理项目...');
  
  const projectRoot = process.cwd();
  
  for (const file of filesToRemove) {
    const fullPath = path.join(projectRoot, file);
    removeFileOrDirectory(fullPath);
  }
  
  console.log('项目清理完成！');
  
  // 检查是否还有需要清理的文件
  console.log('\n检查是否还有需要清理的文件...');
  const remainingFiles = [];
  
  // 检查根目录
  const rootFiles = fs.readdirSync(projectRoot);
  for (const file of rootFiles) {
    const fullPath = path.join(projectRoot, file);
    const stats = fs.statSync(fullPath);
    
    // 跳过.git目录和node_modules目录
    if (file === '.git' || file === 'node_modules') {
      continue;
    }
    
    // 检查是否是临时文件或开发文件
    if (stats.isFile() && (
      file.endsWith('.tmp') || 
      file.endsWith('.temp') || 
      file.endsWith('.log') ||
      file.includes('test') ||
      file.includes('debug')
    )) {
      remainingFiles.push(file);
    }
  }
  
  if (remainingFiles.length > 0) {
    console.log('发现可能需要清理的文件:');
    remainingFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    console.log('请手动检查这些文件是否需要删除。');
  } else {
    console.log('没有发现需要额外清理的文件。');
  }
  
  // 显示项目大小
  console.log('\n计算项目大小...');
  const projectSize = getDirectorySize(projectRoot);
  console.log(`项目总大小: ${(projectSize / 1024 / 1024).toFixed(2)} MB`);
}

// 计算目录大小的函数
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    
    // 跳过.git目录和node_modules目录
    if (file === '.git' || file === 'node_modules') {
      continue;
    }
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(fullPath);
    } else {
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

// 如果直接运行此脚本
if (require.main === module) {
  cleanProject();
}

module.exports = { cleanProject, removeFileOrDirectory };