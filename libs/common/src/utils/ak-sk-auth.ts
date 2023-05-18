/*
 * 基于 ak/sk 鉴权认证机制 CloudAkSkAuth 类
 * @Author: hsycc
 * @Date: 2023-05-09 06:50:25
 * @LastEditTime: 2023-05-18 21:50:23
 * @Description:
 *
 */
import crypto from 'crypto';

export const CONSTANT_AUTH_VERSION_V1 = 'cc-auth-v1';
export const CONSTANT_X_AUTHORIZATION = 'x-authorization';
export interface Keys {
  accessKey: string;
  secretKey: string;
}

export function generateKeyPair(): Keys {
  const secretKeyLength = 40;
  const accessKeyLength = 20;

  // generate a cryptographically secure random string
  const randomString = () =>
    crypto
      .randomBytes(64)
      .toString('base64')
      .replace(/[^\w]/g, '')
      .substring(0, secretKeyLength + accessKeyLength);

  // generate a unique public key and private key pair
  let secretKey, accessKey;
  do {
    const keyString = randomString();
    secretKey = keyString.substring(0, secretKeyLength);
    accessKey = keyString.substring(secretKeyLength, accessKeyLength);
  } while (
    secretKey.length !== secretKeyLength ||
    accessKey.length !== accessKeyLength
  );

  return { accessKey, secretKey };
}

export type CloudAkSkAuthOptions = Keys & {
  version?: 'cc-auth-v1' | string;
};

export type SignAndVerifyType = {
  timestamp: string;
  expirationPeriodInSeconds: number;
  method: string;
  url: string;
  headers?: Record<string, any>;
  query?: Record<string, any>;
};

export class CloudAkSkAuth {
  public accessKey: string;
  public secretKey: string;
  public version: string;
  constructor(options: CloudAkSkAuthOptions) {
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
    this.version = options.version || CONSTANT_AUTH_VERSION_V1;
  }

  public generateKeyPair = generateKeyPair;

  /**
   *
   * @param
   * @returns
   */
  public verify(
    {
      timestamp,
      expirationPeriodInSeconds,
      method,
      url,
      headers = {},
      query = {},
    }: SignAndVerifyType,
    cipher: string,
  ): boolean {
    const authStringPrefix = this.generateAuthStringPrefix(
      timestamp,
      expirationPeriodInSeconds,
    );

    const canonicalRequest = this.generateCanonicalRequest(
      method,
      url,
      headers,
      query,
    );

    const signingKey = this.generateSigningKey(authStringPrefix);

    const signature = this.generateSignature(signingKey, canonicalRequest);

    return cipher === signature;
  }

  /**
   *
   * @param
   * @returns
   */
  public sign({
    timestamp,
    expirationPeriodInSeconds,
    method,
    url,
    headers = {},
    query = {},
  }: SignAndVerifyType): string {
    const authStringPrefix = this.generateAuthStringPrefix(
      timestamp,
      expirationPeriodInSeconds,
    );

    const canonicalRequest = this.generateCanonicalRequest(
      method,
      url,
      headers,
      query,
    );

    const signedHeaders = this.generateSignedHeaders(headers);

    const signingKey = this.generateSigningKey(authStringPrefix);

    const signature = this.generateSignature(signingKey, canonicalRequest);

    return this.generateAuthStr(authStringPrefix, signedHeaders, signature);
  }

  /**
   * 生成认证字符串
   * @param {string} authStringPrefix  cc-auth-v1/{accessKey}/{timestamp}/{expirationPeriodInSeconds}
   * @param {string} signedHeaders 签名算法中涉及到的HTTP头域列表。HTTP头域名字一律要求小写且头域名字之间用分号（;）分隔，如host;range;x-cc-date。列表按照字典序排列。当signedHeaders为空时表示取默认值。
   * @param {string} signature 256位签名的十六进制表示，由64个小写字母组成。它由SK(Secret Access Key)和authStringPrefix哈希得到signingKey，再将canonicalRequest以signingKey为key进行哈希摘要生成，具体算法见下。
   * @returns {string} 示例: cc-auth-v1/{accessKey}/{timestamp}/{expirationPeriodInSeconds}/{signedHeaders}/{signature}
   * cc-auth-v1 为固定值
   *
   */
  public generateAuthStr(
    authStringPrefix: string,
    signedHeaders: string,
    signature: string,
  ): string {
    return `${authStringPrefix}/${signedHeaders}/${signature}`;
  }

  /**
   * 生成 authStringPrefix
   * accessKey  Access Key ID，
   * @param {string} timestamp 生成签名的 UTC 时间，格式为 yyyy-mm-ddThh:mm:ssZ，例如：2015-04-27T08:23:49Z，请注意请求发送时间不能晚于生成签名时间太多，否则请求到达服务端时可能已经超过签名的有效期限。
   * @param { number } expirationPeriodInSeconds 签名有效期限，从 timestamp 所指定的时间开始计算，单位为秒。
   * @returns {string} authStringPrefix, 示例 cc-auth-v1/{accessKey}/{timestamp}/{expirationPeriodInSeconds}
   */
  public generateAuthStringPrefix(
    timestamp: string,
    expirationPeriodInSeconds: number,
  ) {
    return `${this.version}/${this.accessKey}/${timestamp}/${expirationPeriodInSeconds}`;
  }

  /**
   * 生成ASCII码由小到大排序的 signedHeaders
   * @param { Record<string, any> } 要签名的请求头字段
   * @returns  { string }  返回值示例： host;x-cc-meta-data;x-cc-meta-data-tag
   */
  public generateSignedHeaders(headers: Record<string, any>): string {
    const host = headers.host || headers.Host;
    if (!host) {
      throw new Error('The host field in headers must be signed');
    }
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
  public generateSignature(
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
   * @param secretKey  Secret Key ID，请参看获取AK/SK来获取。
   * @param { string } authStringPrefix cc-auth-v1/{accessKey}/{timestamp}/{expirationPeriodInSeconds}
   * @returns { string }
   */
  public generateSigningKey(authStringPrefix: string): string {
    return crypto
      .createHmac('sha256', this.secretKey)
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
      x-cc-test2:xxxxx
   *   
   */
  public generateCanonicalRequest(
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
      this.generateCanonicalQueryString(query) +
      '\n' +
      this.generateCanonicalHeaders(headers)
    );
  }

  /**
   * 生成ASCII码由小到大排序的 queryString
   * @param { Record<string, any> } query   URL中的Query
   * @example {  test1: '测试', text: '', test10: 'test'}
   * @returns  { string }  返回值示例: text10=test&text1=%E6%B5%8B%E8%AF%95&text=
   */
  public generateCanonicalQueryString(query: Record<string, any>): string {
    return Object.keys(query)
      .filter((key) => key !== CONSTANT_X_AUTHORIZATION) // 过滤掉 query 中的 x-authorization
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
  public generateCanonicalHeaders(headers: Record<string, any>): string {
    const host = headers.host || headers.Host;
    if (!host) {
      throw new Error('The host field in headers must be signed');
    }

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
}

// const version = 'cc-auth-v1'; // 固定值

// const ak = 'KqT9eO20jisK3vgmktR5';

// const sk = '1GH6JMiqbhBb0NgTsFcTKqT9eO20jisK3vgmktR5';

// const method = 'post';

// const url = '/ai/invoke/chat_completion';

// const timestamp = '2023-05-16T01:26:57Z';

// const query = {
//   // test: 2,
//   // test2: 3,
// };

// const headers = {
//   Host: '127.0.0.1:9000',
// };

// const expirationPeriodInSeconds = 1800;

// const CloudAkSkAuth = new CloudAkSkAuth({
//   accessKey: ak,
//   secretKey: sk,
//   version,
// });

// console.log(
//   CloudAkSkAuth.sign({
//     method,
//     timestamp,
//     expirationPeriodInSeconds,
//     url,
//     headers,
//     query,
//   }),
// );

// console.log(
//   CloudAkSkAuth.verify(
//     {
//       method,
//       timestamp,
//       expirationPeriodInSeconds,
//       url,
//       headers,
//       query,
//     },
//     'bb701fa6cbaf0ba105d9eccaf7e0f58796234ddb56c9a09084913a7c8db304b0',
//   ),
// );

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
