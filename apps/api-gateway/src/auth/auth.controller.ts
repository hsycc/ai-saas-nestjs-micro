import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Put,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  LoginResponse,
  RegisterResponse,
} from '@proto/gen/auth.pb';
import { Metadata } from '@grpc/grpc-js';

import {
  LoginRequestDto,
  RegisterRequestDto,
} from 'apps/auth-svc/src/auth/auth.dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private svc: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  private async register(
    @Body() body: RegisterRequestDto,
  ): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body, new Metadata());
  }

  @Put('login')
  private async login(
    @Body() body: LoginRequestDto,
  ): Promise<Observable<LoginResponse>> {
    return this.svc.login(body, new Metadata());
  }
}
