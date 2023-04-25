export enum DefaultCode {
  DEFAULT = -1,
}
export enum GrpcErrorAUTHCode {}

// 10001 开头 auth-svc
// 20001 开头 product-svc
// ... ；类推

export type GrpcErrorCode = DefaultCode | GrpcErrorAUTHCode;

export const GenGrpcExceptionError = (message, code: GrpcErrorCode = -1) => {
  return {
    code,
    message,
  };
};
