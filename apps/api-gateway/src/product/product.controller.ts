import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  FindOneResponse,
  ProductServiceClient,
  PRODUCT_SERVICE_NAME,
  CreateProductResponse,
} from '@proto/gen/product.pb';

import { Metadata } from '@grpc/grpc-js';
import { CreateProductRequestDto } from 'apps/product-svc/src/product/product.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../auth/auth.guard';

@Controller('product')
export class ProductController implements OnModuleInit {
  private svc: ProductServiceClient;
  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createProduct(
    @Body() body: CreateProductRequestDto,
  ): Promise<Observable<CreateProductResponse>> {
    const metadata = new Metadata();
    return this.svc.createProduct(body, metadata);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  private async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Observable<FindOneResponse>> {
    const metadata = new Metadata();

    return this.svc.findOne({ id }, metadata);
  }
}
