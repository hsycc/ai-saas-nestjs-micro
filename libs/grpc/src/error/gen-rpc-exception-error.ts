export enum DefaultCode {
  DEFAULT = -1,
}
export enum GrpcErrorUserCode {}

// 10001 开头 user-svc
// 20001 开头 gpt-svc
// ... ；类推

export type GrpcErrorCode = DefaultCode | GrpcErrorUserCode;

export const GenGrpcExceptionError = (message, code: GrpcErrorCode = -1) => {
  return {
    code,
    message,
  };
};
