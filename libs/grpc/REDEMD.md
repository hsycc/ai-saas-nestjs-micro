<!--
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-11 15:20:29
 * @Description:
 *
-->

## grpc-rpcExceptions

```ts
throw new GrpcUnauthenticatedException(); // 401 Unauthorized
throw new GrpcNotFoundException(); // 404 Not Found
throw new GrpcPermissionDeniedException(); // 403 Forbidden

throw new GrpcInternalException('内部错误xxx');
throw new GrpcUnknownException('自定义错误');
throw new GrpcInvalidArgumentException('参数错误');
```
