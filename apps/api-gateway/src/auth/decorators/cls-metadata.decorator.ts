/*
 * 获取当 ak/sk 鉴权的所属渠道用户信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-06-05 00:03:45
 * @Description:
 *
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { ClsServiceManager } from 'nestjs-cls';
import { User } from '@prisma/@user-client';

export interface FormatClsMetadata {
  trackId?: string;
  requestId?: string;
  tenantId?: string;
  userId?: string;
  user?: User;
  tenant?: User;
}

export const GenerateClsMetadata = createParamDecorator(
  (
    data: null | 'withEmptyMetadata' = null,
    ctx: ExecutionContext,
  ): Metadata => {
    const metadata = new Metadata();

    if (data) {
      return metadata;
    }

    const req = ctx.switchToHttp().getRequest();

    const cls = ClsServiceManager.getClsService();

    metadata.set('requestId', req.requestId || cls.getId());
    metadata.set('tenantId', req.tenant?.id || req.tenantId || -1);
    metadata.set('userId', req.user?.id || req.userId || -1);

    return metadata;
  },
);

export const FormatClsMetadata = (): FormatClsMetadata => {
  const cls = ClsServiceManager.getClsService();
  const FormatClsMetadata = {
    userId: cls.get('userId') || -1,
    tenantId: cls.get('tenantId') || -1,
    requestId: cls.get('requestId') || cls.getId(),
  };
  return FormatClsMetadata;
};

export const FormatClsMetadataToMetadata = (): Metadata => {
  const formatClsMetadata = FormatClsMetadata();
  const metadata = new Metadata();
  Object.keys(formatClsMetadata).map((v) => {
    metadata.set(v, formatClsMetadata[v]);
  });

  return metadata;
};
