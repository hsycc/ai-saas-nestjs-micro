/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:52:25
 * @LastEditTime: 2023-06-05 01:12:15
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
  expiresIn: string;
}
export interface AiConfigType {
  apiKey: string;
}

export interface MicroConfigType {
  microPortGw: string;

  microServerAddrUser: string;
  microPortUser: string;

  microServerAddrAi: string;
  microPortAi: string;

  // sedMicroConfigUnRemove
}

export interface RpcConfigType {
  gwConnectAiRpcWithOutNacos: string;

  gwConnectUserRpcWithOutNacos: string;

  PortAi: string;
  // sedRpcConfigUnRemove
}

export interface OssConfigType {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RedisConfigType {}

export interface NacosConfigType {
  enable: boolean;
  serverAddr: string | string[];
  namespace: string;
  group: string;
  username: string;
  password: string;
}

export interface OpentelemetryConfigType {
  enable: boolean;
  zipkinUrl: string;
}
