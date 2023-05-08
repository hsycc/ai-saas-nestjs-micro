import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]): any => SetMetadata('role', roles);
