import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  ValidateResponse,
} from '@proto/gen/user.pb';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class UserService {
  private svc: UserServiceClient;

  constructor(
    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async validate(token: string): Promise<Observable<ValidateResponse>> {
    return this.svc.validate({ token }, new Metadata());
  }
}
