/*
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-19 03:14:43
 * @Description:
 *
 */
export enum DefaultCode {
  DEFAULT = -1,
}
export enum GrpcErrorUserCode {}

// 10001 开头 user-svc
// 20001 开头 ai-svc
// ... ；类推

export type GrpcErrorCode = DefaultCode | GrpcErrorUserCode;

export const GenGrpcExceptionError = (message, code: GrpcErrorCode = -1) => {
  return {
    code,
    message,
  };
};
