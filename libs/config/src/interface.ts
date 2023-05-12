/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:52:25
 * @LastEditTime: 2023-05-10 23:55:41
 * @Description:
 *
 */
export interface ConfigType {
  JwtConfigType;
  GptConfigType;

  MicroConfigType;
  OssConfigType;

  RedisConfigType;
}

export interface JwtConfigType {
  accessSecretKey: string;
  refreshSecretKey: string;
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}
export interface GptConfigType {
  apiKey: string;
}

export interface MicroConfigType {
  microDomainUser: string;
  microPortUser: string;
  microProtoUser: string;

  microDomainGpt: string;
  microPortGpt: string;
  microProtoGpt: string;

  microDomainAi: string;
  microPortAi: string;
  microProtoAi: string;
}

export interface OssConfigType {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RedisConfigType {}
