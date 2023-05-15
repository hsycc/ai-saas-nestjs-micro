/*
 * @Author: hsycc
 * @Date: 2023-05-10 23:21:34
 * @LastEditTime: 2023-05-15 13:10:07
 * @Description:
 *
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  OnModuleInit,
  Inject,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiExtension, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ApiBaseResponse,
  ApiListResponse,
  ApiPaginatedResponse,
  ApiObjResponse,
  BaseApiExtraModels,
  PaginatedDto,
} from '@lib/swagger';
import { Metadata } from '@grpc/grpc-js';

import {
  AI_CHAT_MODEL_SERVICE_NAME,
  AiChatModelServiceClient,
} from '@proto/gen/ai.pb';
import { ChatModelEntity } from 'apps/ai-svc/src/chat/entities/chat-model.entity';
import {
  CreateChatModelDto,
  UpdateChatModelDto,
} from 'apps/ai-svc/src/chat/dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { ChatDto } from './chat.dto';
import { OpenaiService } from './open-ai.service';

@ApiTags('ai')
@Controller('ai')
@BaseApiExtraModels(ChatModelEntity)
export class AiController implements OnModuleInit {
  private svc: AiChatModelServiceClient;

  constructor(
    @Inject(AI_CHAT_MODEL_SERVICE_NAME)
    private readonly client: ClientGrpc,

    private readonly openaiService: OpenaiService,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<AiChatModelServiceClient>(
      AI_CHAT_MODEL_SERVICE_NAME,
    );
  }

  /**
   *  渠道设备调用 ai 会话能力
   */
  @Post('invoke/chat')
  @Auth('ak/sk')
  private async chat(@Body() chatDto: ChatDto) {
    return this.openaiService.chat(chatDto);
  }

  /**
   *  渠道设备调用 ai stt 能力
   */
  @Post('invoke/stt')
  @Auth('ak/sk')
  private async stt() {}

  /**
   *  渠道设备调用 ai tts 能力
   */
  @Post('invoke/tts')
  @Auth('ak/sk')
  @ApiExtension('x-foo', { hello: 'world' })
  private async tts() {}

  /**
   * 渠道用户创建会话模型
   * TODO: 去掉相同name的重复创建
   */
  @Post('chat/model')
  @Auth('jwt')
  @ApiObjResponse(ChatModelEntity)
  private async createChatModel(
    @CurrentUser() userId,
    @Body() createChatModelDto: CreateChatModelDto,
  ) {
    console.log('createChatModelDto', createChatModelDto);

    return this.svc.createChatModel(
      {
        userId,
        ...createChatModelDto,
      },
      new Metadata(),
    );
  }

  /**
   * 渠道用户删除会话模型
   */
  @Delete('chat/model/:id')
  @Auth('jwt')
  @ApiBaseResponse()
  private async deleteChatModel(
    @CurrentUser() userId,
    @Param('id') id: string,
  ) {
    return this.svc.deleteChatModel({ userId, id }, new Metadata());
  }

  /**
   * 渠道用户获取会话模型列表
   */
  @Get('chat/model')
  @Auth('jwt')
  @ApiPaginatedResponse(ChatModelEntity)
  private async getChatModelList(
    @CurrentUser() userId,
    @Query() paginatedDto: PaginatedDto,
  ) {
    return this.svc.getChatModelList(
      { userId, ...paginatedDto },
      new Metadata(),
    );
  }

  /**
   * 渠道用户获取会话模型详情
   */
  @Get('chat/model/:id')
  @Auth('jwt')
  @ApiObjResponse(ChatModelEntity)
  private async getChatModelById(
    @CurrentUser() userId,
    @Param('id') id: string,
  ) {
    return this.svc.getChatModelById({ userId, id }, new Metadata());
  }

  /**
   * 渠道用户更新会话模型
   */
  @Patch('chat/model/:id')
  @Auth('jwt')
  @ApiBaseResponse()
  private async updateUser(
    @CurrentUser() userId,
    @Body() updateChatModelDto: UpdateChatModelDto,
  ) {
    return this.svc.updateChatModel(
      {
        userId: userId,
        ...updateChatModelDto,
      },
      new Metadata(),
    );
  }
}
