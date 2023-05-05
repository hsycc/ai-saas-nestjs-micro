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
}

export interface OssConfigType {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RedisConfigType {}
