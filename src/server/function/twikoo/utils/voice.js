const os = require('os')
const path = require('path')
const fs = require('fs')
const { RES_CODE } = require('./constants')
const logger = require('./logger')

// 语音上传函数
exports.uploadVoice = async (event, config) => {
  logger.log('接收到语音上传请求:', {
    hasVoice: !!event.voice,
    fileName: event.fileName,
    voiceLength: event.voice ? event.voice.length : 0
  })
  const { voice, fileName } = event
  const res = {}
  try {
    if (!config.VOICE_CDN) {
      throw new Error('未配置语音上传服务')
    }

    // 检查必要的配置项
    if (config.VOICE_CDN === 'qcloud') {
      if (!config.VOICE_CDN_TOKEN || !config.VOICE_CDN_SECRET ||
          !config.VOICE_CDN_DOMAIN || !config.VOICE_CDN_REGION || !config.VOICE_CDN_BUCKET) {
        throw new Error('语音上传服务配置不完整，请检查腾讯云对象存储相关配置')
      }
      await uploadVoiceToQcloud({ voice, fileName, config, res })
    } else if (config.VOICE_CDN === 'upyun') {
      if (!config.VOICE_CDN_TOKEN || !config.VOICE_CDN_SECRET ||
          !config.VOICE_CDN_DOMAIN || !config.VOICE_CDN_BUCKET) {
        throw new Error('语音上传服务配置不完整，请检查又拍云相关配置')
      }
      // 又拍云上传逻辑待实现
      throw new Error('又拍云语音上传服务暂未实现')
    } else if (config.VOICE_CDN === 'github') {
      if (!config.VOICE_CDN_TOKEN || !config.VOICE_CDN_DOMAIN || !config.VOICE_CDN_BUCKET) {
        throw new Error('语音上传服务配置不完整，请检查GitHub相关配置')
      }
      // GitHub上传逻辑待实现
      throw new Error('GitHub语音上传服务暂未实现')
    } else {
      throw new Error('不支持的语音上传服务')
    }
  } catch (e) {
    logger.error(e)
    res.code = RES_CODE.UPLOAD_FAILED
    res.err = e.message
    res.message = e.message // 添加message字段，确保客户端能够正确获取错误信息
  }
  return res
}

// 腾讯云对象存储上传
async function uploadVoiceToQcloud ({ voice, fileName, config, res }) {
  try {
    // 腾讯云对象存储
    const COS = require('cos-nodejs-sdk-v5')
    logger.log('COS SDK 导入成功')

    // 检查存储桶格式，腾讯云对象存储的存储桶名称应该包含APPID，格式为<bucketname>-<appid>
    const bucketName = config.VOICE_CDN_BUCKET
    logger.log('存储桶名称:', bucketName)
    
    if (!bucketName.includes('-')) {
      throw new Error('腾讯云对象存储的存储桶名称格式不正确，应该为<bucketname>-<appid>格式，例如：mybucket-1250000000')
    }

    // 从存储桶名称中提取APPID
    const bucketParts = bucketName.split('-')
    const appid = bucketParts[bucketParts.length - 1]
    logger.log('提取的APPID:', appid)

    // 验证配置
    logger.log('腾讯云配置验证:', {
      hasToken: !!config.VOICE_CDN_TOKEN,
      hasSecret: !!config.VOICE_CDN_SECRET,
      hasDomain: !!config.VOICE_CDN_DOMAIN,
      hasRegion: !!config.VOICE_CDN_REGION
    })

    // 使用用户提供的腾讯云对象存储信息
    const cos = new COS({
      SecretId: config.VOICE_CDN_TOKEN,
      SecretKey: config.VOICE_CDN_SECRET,
      Domain: config.VOICE_CDN_DOMAIN,
      Region: config.VOICE_CDN_REGION,
      AppId: appid,
      ForcePathStyle: true
    })
    logger.log('COS客户端创建成功')

    // 生成文件路径
    const filePath = config.VOICE_CDN_PATH || '/twikoo'
    const fullFilePath = `${filePath}/${fileName}`
    logger.log('文件路径:', fullFilePath)

    // 将base64转换为Buffer
    const base64 = voice.split(';base64,').pop()
    const voiceBuffer = Buffer.from(base64, 'base64')
    logger.log('语音数据转换成功，大小:', voiceBuffer.length, 'bytes')

    return await new Promise((resolve, reject) => {
      logger.log('开始上传到腾讯云对象存储')
      cos.putObject({
        Bucket: bucketName,
        Region: config.VOICE_CDN_REGION,
        Key: fullFilePath,
        Body: voiceBuffer,
        ContentType: 'audio/wav'
      }, (err, data) => {
        if (err) {
          logger.error('腾讯云对象存储上传失败:', err)
          logger.error('错误代码:', err.code)
          logger.error('错误状态:', err.statusCode)
          logger.error('配置信息:', {
            Bucket: bucketName,
            Region: config.VOICE_CDN_REGION,
            Key: fullFilePath,
            Domain: config.VOICE_CDN_DOMAIN,
            ContentType: 'audio/wav',
            FileSize: voiceBuffer.length,
            AppId: appid
          })
          const errorMessage = `语音上传失败: ${err.message || '未知错误'} (代码: ${err.code || 'unknown'}, 状态: ${err.statusCode || 'unknown'})`
          reject(new Error(errorMessage))
        } else {
          logger.log('腾讯云对象存储上传成功，返回数据:', data)
          // 构建访问URL
          const url = `https://${bucketName}.${config.VOICE_CDN_DOMAIN}${fullFilePath}`
          res.data = {
            url: url,
            fileName: fileName,
            size: voiceBuffer.length
          }
          logger.log('上传成功，生成的URL:', url)
          resolve(res)
        }
      })
    })
  } catch (e) {
    // 捕获所有错误，并设置到res对象中
    logger.error('语音上传处理过程中发生错误:', e)
    logger.error('错误类型:', e.name)
    logger.error('错误堆栈:', e.stack)
    res.code = RES_CODE.UPLOAD_FAILED
    res.err = e.message
    res.message = e.message
    res.errorType = e.name
    return res
  }
}

// Base64 URL 转换为可读流
exports.base64UrlToReadStream = (base64Url, fileName) => {
  const base64 = base64Url.split(';base64,').pop()
  const writePath = path.resolve(os.tmpdir(), fileName)
  fs.writeFileSync(writePath, base64, { encoding: 'base64' })
  return fs.createReadStream(writePath)
}
