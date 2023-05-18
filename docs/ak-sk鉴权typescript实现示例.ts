/*
 * @Author: hsycc
 * @Date: 2023-05-15 15:11:44
 * @LastEditTime: 2023-05-18 20:46:42
 * @Description:
 *
 */
import crypto from 'crypto';

/**
 * 生成认证字符串
 * @param {string} authStringPrefix cc-auth-v1/{accessKey}/{timestamp}/{expirationPeriodInSeconds}
 * @param {string} signedHeaders 签名算法中涉及到的HTTP头域列表。HTTP头域名字一律要求小写且头域名字之间用分号（;）分隔，如host;range;x-cc-date。列表按照字典序排列。当signedHeaders为空时表示取默认值。
 * @param {string} signature 256位签名的十六进制表示，由64个小写字母组成。它由SK(Secret Access Key)和authStringPrefix哈希得到signingKey，再将canonicalRequest以signingKey为key进行哈希摘要生成，具体算法见下。
 * @returns {string} 示例: cc-auth-v1/{accessKey}/{timestamp}/{expirationPeriodInSeconds}/{signedHeaders}/{signature}
 * cc-auth-v1 为固定值
 *
 */
function generateAuthStr(
  authStringPrefix: string,
  signedHeaders: string,
  signature: string,
): string {
  return `${authStringPrefix}/${signedHeaders}/${signature}`;
}

/**
 * 生成 authStringPrefix
 * @param {string} ak Access Key ID，
 * @param {string} timestamp 生成签名的 UTC 时间，格式为 yyyy-mm-ddThh:mm:ssZ，例如：2015-04-27T08:23:49Z，请注意请求发送时间不能晚于生成签名时间太多，否则请求到达服务端时可能已经超过签名的有效期限。
 * @param { number } expirationPeriodInSeconds 签名有效期限，从 timestamp 所指定的时间开始计算，单位为秒。
 * @returns {string} authStringPrefix, 示例 cc-auth-v1/{accessKeyId}/{timestamp}/{expirationPeriodInSeconds}
 */
function generateAuthStringPrefix(
  ak: string,
  timestamp: string,
  expirationPeriodInSeconds: number,
) {
  return `${version}/${ak}/${timestamp}/${expirationPeriodInSeconds}`;
}

/**
 * 生成ASCII码由小到大排序的 signedHeaders
 * @param { Record<string, any> } 要签名的请求头字段
 * @returns  { string }  返回值示例： host;x-cc-meta-data;x-cc-meta-data-tag
 */
function generateSignedHeaders(headers: Record<string, any>): string {
  return Object.keys(headers)
    .map((v: string) => v.toLowerCase())
    .join(';');
}

/**
 * 生成 signature 签名摘要
 * @param { string } signingKey 派生密钥
 * @param { string } canonicalRequest
 * @returns { string } HMAC-SHA256-HEX(canonicalRequest,canonicalRequest)
 */
function generateSignature(
  signingKey: string,
  canonicalRequest: string,
): string {
  return crypto
    .createHmac('sha256', signingKey)
    .update(canonicalRequest)
    .digest('hex');
}

/**
 * 生成 派生密钥
 * @param secretKeyId  Secret Key ID，请参看获取AK/SK来获取。
 * @param { string } authStringPrefix cc-auth-v1/{accessKeyId}/{timestamp}
 * @returns { string }
 */
function generateSigningKey(
  secretKeyId: string,
  authStringPrefix: string,
): string {
  return crypto
    .createHmac('sha256', secretKeyId)
    .update(authStringPrefix)
    .digest('hex');
}

/**
 * 生成 canonicalRequest
 * @param { string } signingKey 派生密钥
 * @param { string } canonicalRequest 
 * @returns { string } HTTP Method + "\n" + CanonicalURI + "\n" + CanonicalQueryString + "\n" + CanonicalHeaders，
 * 
 * 返回值示例
    POST
    /ai/chat/v1
    partNumber=9&uploadId=1xas # 如果 query 为空， 占位空行
    host:127.0.0.1
    x-cc-test:xxxx
 *   
 */
function generateCanonicalRequest(
  method: string,
  url: string,
  headers: Record<string, any>,
  query: Record<string, any>,
): string {
  return (
    method.toUpperCase() +
    '\n' +
    encodeURI(url) +
    '\n' +
    generateCanonicalQueryString(query) +
    '\n' +
    generateCanonicalHeaders(headers)
  );
}

/**
 * 生成ASCII码由小到大排序的 queryString
 * @param { Record<string, any> } query   URL中的Query
 * @example {  test1: '测试', text: '', test10: 'test'}
 * @returns  { string }  返回值示例: text10=test&text1=%E6%B5%8B%E8%AF%95&text=
 */
function generateCanonicalQueryString(query: Record<string, any>): string {
  return Object.keys(query)
    .map((key: string) => {
      return (
        encodeURIComponent(key) +
        '=' +
        (query[key] ? encodeURIComponent(query[key]) : '')
      );
    })
    .sort()
    .join('&');
}

/**
 * 生成ASCII码由小到大排序的 canonicalHeaders
 * @param { Record<string, any> } headers
 * @returns  { string }
 */
function generateCanonicalHeaders(headers: Record<string, any>): string {
  return Object.keys(headers)
    .map((key: string) => {
      return (
        encodeURIComponent(key.toLowerCase()) +
        ':' +
        (headers[key]?.trim() ? encodeURIComponent(headers[key]?.trim()) : '')
      );
    })
    .sort()
    .join('\n');
}

const version = 'cc-auth-v1'; // 固定值

const ak = 'KqT9eO20jisK3vgmktR5';

const sk = '1GH6JMiqbhBb0NgTsFcTKqT9eO20jisK3vgmktR5';

const method = 'post';

const url = '/ai/invoke/chat_completion';

const timestamp = '2023-05-16T01:26:57Z';

const query = {
  // test: 2,
  // test2: 3,
};

const headers = {
  Host: '127.0.0.1:9000',
};

const expirationPeriodInSeconds = 1800;

const authStringPrefix = generateAuthStringPrefix(
  ak,
  timestamp,
  expirationPeriodInSeconds,
);

console.log('======= authStringPrefix ========');
console.log(authStringPrefix);

const canonicalRequest = generateCanonicalRequest(method, url, headers, query);
console.log('======= canonicalRequest ========');
console.log(canonicalRequest);

const signedHeaders = generateSignedHeaders(headers);

console.log('======= signedHeaders ========');
console.log(signedHeaders);

const signingKey = generateSigningKey(sk, authStringPrefix);

console.log('======= signingKey ========');
console.log(signingKey);

const signature = generateSignature(signingKey, canonicalRequest);

console.log('======= signature ========');
console.log(signature);

console.log(generateAuthStr(authStringPrefix, signedHeaders, signature));

// ======= authStringPrefix ========
// cc-auth-v1/KqT9eO20jisK3vgmktR5/2023-05-16T01:26:57Z/1800
// ======= canonicalRequest ========
// POST
// /ai/invoke/chat_completion

// host:127.0.0.1%3A9000
// ======= signedHeaders ========
// host
// ======= signingKey ========
// 2fd6c59d0f700d11d8ac2ac8cb8a672d1e4da4577acfd53dc50a547e7ba0c1e5
// ======= signature ========
// bb701fa6cbaf0ba105d9eccaf7e0f58796234ddb56c9a09084913a7c8db304b0
// cc-auth-v1/KqT9eO20jisK3vgmktR5/2023-05-16T01:26:57Z/1800/host/bb701fa6cbaf0ba105d9eccaf7e0f58796234ddb56c9a09084913a7c8db304b0
