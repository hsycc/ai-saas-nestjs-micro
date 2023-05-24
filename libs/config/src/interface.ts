/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:52:25
 * @LastEditTime: 2023-05-25 16:51:14
 * @Description:
 *
 */
export interface ConfigType {
  JwtConfigType;
  AiConfigType;

  MicroConfigType;
  OssConfigType;

  RedisConfigType;
}

export interface JwtConfigType {
  accessSecretKey: string;
  refreshSecretKey: string;
  expiresIn: string;
  refreshIn: string;
}
export interface AiConfigType {
  apiKey: string;
}

export interface MicroConfigType {
  microDomainUser: string;
  microPortUser: string;
  microProtoUser: string;

  microDomainAi: string;
  microPortAi: string;
  microProtoAi: string;

  // sedMicroConfigUnRemove
}

export interface OssConfigType {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RedisConfigType {}
