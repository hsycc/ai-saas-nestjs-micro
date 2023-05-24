/*
 * @Author: hsycc
 * @Date: 2023-05-10 23:21:34
 * @LastEditTime: 2023-05-24 23:01:33
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ApiBaseResponse,
  ApiPaginatedResponse,
  ApiObjResponse,
  BaseApiExtraModels,
  PaginatedDto,
} from '@lib/swagger';
import Utils from '@lib/common/utils/helper';
import { Metadata } from '@grpc/grpc-js';
import {
  AI_CHAT_MODEL_SERVICE_NAME,
  AI_SPEECH_SERVICE_NAME,
  AI_PACKAGE_NAME,
  AiChatModelServiceClient,
  AiSpeechServiceClient,
} from '@proto/gen/ai.pb';
import { CreateChatModelDto, UpdateChatModelDto } from '@app/ai-svc/chat/dto';
import { ChatModelEntity } from '@app/ai-svc/chat/entities/chat-model.entity';
import { CreateChatCompletionDto } from '@app/ai-svc/chat/dto/create-chat-completion.dto';
import { CurrentAkSkOfUser } from '../auth/decorators/ak-sk-of-user.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  CreateChatCompletionChoicesDto,
  CreateChatCompletionResponseChoicesInnerDto,
} from '@app/ai-svc/chat/dto/create-chat-completion-choices.dto';
import { SpeechFileInterceptor } from '@lib/common';
import {
  CreateTranscriptionRequestDto,
  CreateTranscriptionResponseDto,
} from '@app/ai-svc/speech/dto';

@ApiTags('ai')
@Controller('ai')
@BaseApiExtraModels(
  ChatModelEntity,
  CreateChatCompletionChoicesDto,
  CreateChatCompletionResponseChoicesInnerDto,
  CreateTranscriptionResponseDto,
  CreateChatCompletionDto,
)
export class AiController implements OnModuleInit {
  private aiChatModelServiceClient: AiChatModelServiceClient;

  private aiSpeechServiceClient: AiSpeechServiceClient;

  constructor(
    @Inject(AI_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.aiChatModelServiceClient =
      this.client.getService<AiChatModelServiceClient>(
        AI_CHAT_MODEL_SERVICE_NAME,
      );

    this.aiSpeechServiceClient = this.client.getService<AiSpeechServiceClient>(
      AI_SPEECH_SERVICE_NAME,
    );
  }

  /**
   *  渠道设备调用 ai 会话能力
   */
  @Post('invoke/chat_completion')
  @Auth('ak/sk', {
    // 跳过鉴权检验
    skipApiAuth: Utils.isDev,
  })
  @ApiObjResponse(CreateChatCompletionChoicesDto)
  private async createChatCompletion(
    @Body() dto: CreateChatCompletionDto,
    @CurrentAkSkOfUser() userId,
  ) {
    const metadata = new Metadata();
    metadata.set('userId', userId);
    return this.aiChatModelServiceClient.createChatCompletion(dto, metadata);
  }
  /**
   *  渠道设备调用 ai stt 能力
   */
  @Post('invoke/stt')
  @Auth('ak/sk', {
    // 跳过鉴权检验
    skipApiAuth: Utils.isDev,
  })
  @UseInterceptors(SpeechFileInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateTranscriptionRequestDto,
  })
  @ApiObjResponse(CreateTranscriptionResponseDto)
  private async stt(
    @UploadedFile() file: Express.Multer.File,
    @CurrentAkSkOfUser() userId,
  ) {
    const metadata = new Metadata();
    metadata.set('userId', userId);
    return this.aiSpeechServiceClient.createTranscription(
      {
        buffer: file.buffer,
      },
      metadata,
    );
  }

  /**
   *  渠道设备调用 ai tts 能力
   */
  @Post('invoke/tts')
  @Auth('ak/sk')
  private async tts() {}

  /**
   * 渠道用户创建会话模型
   */
  @Post('chat/model')
  @Auth('jwt')
  @ApiObjResponse(ChatModelEntity)
  private async createChatModel(
    @CurrentUser() userId,
    @Body() createChatModelDto: CreateChatModelDto,
  ) {
    const metadata = new Metadata();
    metadata.set('userId', userId);

    return this.aiChatModelServiceClient.createChatModel(
      {
        ...createChatModelDto,
      },
      metadata,
    );
  }

  /**
   * 渠道用户删除会话模型
   */
  @Delete('chat/model/:id')
  @Auth('jwt')
  @ApiParam({
    name: 'id',
    example: 'clhszs0lb0000ualegqse23dg',
  })
  @ApiBaseResponse()
  private async deleteChatModel(
    @CurrentUser() userId,
    @Param('id') id: string,
  ) {
    const metadata = new Metadata();
    metadata.set('userId', userId);
    return this.aiChatModelServiceClient.deleteChatModel({ id }, metadata);
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
    const metadata = new Metadata();
    metadata.set('userId', userId);
    return this.aiChatModelServiceClient.getChatModelList(
      { ...paginatedDto },
      metadata,
    );
  }

  /**
   * 渠道用户获取会话模型详情
   */
  @Get('chat/model/:id')
  @Auth('jwt')
  @ApiParam({
    name: 'id',
    example: 'clht05un60000uam8fc8pdcpz',
  })
  @ApiObjResponse(ChatModelEntity)
  private async getChatModelById(
    @CurrentUser() userId,
    @Param('id') id: string,
  ) {
    const metadata = new Metadata();
    metadata.set('userId', userId);
    return this.aiChatModelServiceClient.getChatModelById({ id }, metadata);
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
    const metadata = new Metadata();
    metadata.set('userId', userId);

    return this.aiChatModelServiceClient.updateChatModel(
      {
        ...updateChatModelDto,
      },
      metadata,
    );
  }
}
