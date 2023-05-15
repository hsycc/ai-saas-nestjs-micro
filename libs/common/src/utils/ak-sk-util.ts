/*
 * ak/sk 工具函数
 * @Author: hsycc
 * @Date: 2023-05-09 06:50:25
 * @LastEditTime: 2023-05-15 15:53:29
 * @Description:
 *
 */
import * as Crypto from 'crypto';

export interface Keys {
  accessKey: string;
  secretKey: string;
}

export function generateKeyPair(): Keys {
  const secretKeyLength = 40;
  const accessKeyLength = 20;

  // generate a cryptographically secure random string
  const randomString = () =>
    Crypto.randomBytes(64)
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

export type CloudAuthOptions = Keys & {
  version?: 'cc-auth-v1' | string;
};

export type SignAndVerifyType = {
  date: string;
  method: string;
  url: string;
  headers?: Record<string, any>;
  query?: Record<string, any>;
};

export class CloudAuth {
  public accessKey: string;
  public secretKey: string;
  public version: string;
  constructor(options: CloudAuthOptions) {
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
    this.version = options.version || 'cc-auth-v1';
  }

  /**
   *
   * @param
   * @returns
   */
  public verify(
    { date, method, url, headers = {}, query = {} }: SignAndVerifyType,
    cipher,
  ): boolean {
    const canonicalRequest = this.generateCanonicalRequest(
      method,
      url,
      headers,
      query,
    );

    const authStringPrefix = this.generateAuthStringPrefix(date);

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
    date,
    method,
    url,
    headers = {},
    query = {},
  }: SignAndVerifyType): string {
    const authStringPrefix = this.generateAuthStringPrefix(date);

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
   * @param {string} authStringPrefix  cc-auth-v1/{accessKey}/{date}
   * @param {string} signedHeaders 签名算法中涉及到的HTTP头域列表。HTTP头域名字一律要求小写且头域名字之间用分号（;）分隔，如host;range;x-cc-date。列表按照字典序排列。当signedHeaders为空时表示取默认值。
   * @param {string} signature 256位签名的十六进制表示，由64个小写字母组成。它由SK(Secret Access Key)和authStringPrefix哈希得到signingKey，再将canonicalRequest以signingKey为key进行哈希摘要生成，具体算法见下。
   * @returns {string} 示例: cc-auth-v1/{accessKey}/{date}/{signedHeaders}/{signature}
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
   * @param {string} date 签名的UTC日期，格式为yyyymmdd，例如：20150427。
   * @returns {string} authStringPrefix, 示例 cc-auth-v1/{accessKey}/{date}
   */
  public generateAuthStringPrefix(date: string) {
    return `${this.version}/${this.accessKey}/${date}`;
  }

  /**
   * 生成ASCII码由小到大排序的 signedHeaders
   * @param { Record<string, any> } 要签名的请求头字段
   * @returns  { string }  返回值示例： host;x-cc-meta-data;x-cc-meta-data-tag
   */
  public generateSignedHeaders(headers: Record<string, any>): string {
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
    return Crypto.createHmac('sha256', signingKey)
      .update(canonicalRequest)
      .digest('hex');
  }

  /**
   * 生成 派生密钥
   * @param secretKey  Secret Key ID，请参看获取AK/SK来获取。
   * @param { string } authStringPrefix cc-auth-v1/{accessKey}/{date}
   * @returns { string }
   */
  public generateSigningKey(authStringPrefix: string): string {
    return Crypto.createHmac('sha256', this.secretKey)
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
