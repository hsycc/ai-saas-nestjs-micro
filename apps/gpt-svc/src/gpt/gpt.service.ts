import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GPT } from './gpt.entity';

@Injectable()
export class GptService implements OnModuleInit {
  constructor(
    // @Inject(PRODUCT_SERVICE_NAME)
    // private readonly client: ClientGrpc,

    @InjectRepository(GPT)
    private readonly repository: Repository<GPT>,
  ) {}

  public onModuleInit(): void {
    // this.productSvc =
    //   this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  public async stt() {
    //
  }
}
