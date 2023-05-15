import crypto from 'crypto';

// TODO:
// x-cc-date 签名时间
// x-cc-expiration 过期时间
// headersToSign
// 错误码 实现

/**
 * 生成认证字符串
 * @param {string} authStringPrefix  cc-auth-v1/{accessKeyId}/{date}
 * @param {string} signedHeaders 签名算法中涉及到的HTTP头域列表。HTTP头域名字一律要求小写且头域名字之间用分号（;）分隔，如host;range;x-cc-date。列表按照字典序排列。当signedHeaders为空时表示取默认值。
 * @param {string} signature 256位签名的十六进制表示，由64个小写字母组成。它由SK(Secret Access Key)和authStringPrefix哈希得到signingKey，再将canonicalRequest以signingKey为key进行哈希摘要生成，具体算法见下。
 * @returns {string} 示例: cc-auth-v1/{accessKeyId}/{date}/{signedHeaders}/{signature}
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
 * @param {string} date 签名的UTC日期，格式为yyyymmdd，例如：20150427。
 * @returns {string} authStringPrefix, 示例 cc-auth-v1/{accessKeyId}/{date}
 */
function generateAuthStringPrefix(ak: string, date: string) {
  return `${version}/${sk}/${date}`;
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
 * @param { string } authStringPrefix cc-auth-v1/{accessKeyId}/{date}
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
    GET
    /ai/chat/v1
    partNumber=9&uploadId=1xas
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

const ak = '2896b491041b0b3cee7e';

const sk = 'dcc6165155e68ad86ac7427da2da25c9db6c3a33';

const method = 'post';

const url = '/ai/v1/chat';

const date = '20230513';

const query = {
  test: '',
  test1: '测试',
  test10: 'test',
};

const headers = {
  Host: '127.0.0.1',
  'Content-Type': 'text/plain',
  'Content-Length': '8',
  'Content-Md5': ' KasdcPqhviXdjRNnxcko4rw==',
  date,
  'x-cc-date': '2023-04-13T08:23:49Z',
};

const authStringPrefix = generateAuthStringPrefix(ak, date);

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

console.log(
  '最后的认证字符串',
  generateAuthStr(authStringPrefix, signedHeaders, signature),
);

// curl -X 'POST' \
//   'http://127.0.0.1:9000/ai/invoke/chat' \
//   -H 'accept: */*' \
//   -H 'x-cc-date: 2023-05-15T05:12:58.231Z' \
//   -H 'x-cc-expiration: 2023-05-15T05:12:58.231Z' \
//   -H 'X-authorization: cc-auth-v1/2896b491041b0b3cee7e/20230513/host;content-type;content-length;content-md5;date;x-cc-date/436bce18bdf45df329e401f79a48a04f2146d08dd480ef2581a1615287e77249' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "chaModelId": "string",
//   "question": "string",
//   "messages": [
//     {}
//   ]
// }'
