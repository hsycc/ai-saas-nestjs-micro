import { registerAs } from '@nestjs/config';

// https://help.aliyun.com/document_detail/111256.html

export default registerAs('ossConfig', () => ({
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  region: process.env.OSS_REGION,
}));
