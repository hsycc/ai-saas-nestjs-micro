/*
 * @Author: hsycc
 * @Date: 2023-05-10 23:21:34
 * @LastEditTime: 2023-06-02 07:17:22
 * @Description:
 *
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  ServiceUnavailableException,
  UploadedFile,
  Inject,
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

import {
  AI_CHAT_MODEL_SERVICE_NAME,
  AI_SPEECH_SERVICE_NAME,
  GRPC_AI_V1_PACKAGE_NAME,
  AiChatModelServiceClient,
  AiSpeechServiceClient,
} from '@proto/gen/ai.pb';
import { CreateChatModelDto, UpdateChatModelDto } from '@app/ai-svc/chat/dto';
import { ChatModelEntity } from '@app/ai-svc/chat/entities/chat-model.entity';
import { CreateChatCompletionDto } from '@app/ai-svc/chat/dto/create-chat-completion.dto';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';
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
import { GenerateClsMetadata } from '../auth/decorators/cls-metadata.decorator';

@ApiTags('ai')
@Controller('ai')
@BaseApiExtraModels(
  ChatModelEntity,
  CreateChatCompletionChoicesDto,
  CreateChatCompletionResponseChoicesInnerDto,
  CreateTranscriptionResponseDto,
  CreateChatCompletionDto,
)
export class AiController {
  constructor(
    @Inject(GRPC_AI_V1_PACKAGE_NAME)
    private readonly clients: ClientGrpc[],
  ) {}
  get aiChatModelServiceClient(): AiChatModelServiceClient {
    if (this.clients.length === 0) {
      throw new ServiceUnavailableException();
    }
    // 软负载均衡
    const randomIndex = Math.floor(Math.random() * this.clients.length);
    return this.clients[randomIndex].getService<AiChatModelServiceClient>(
      AI_CHAT_MODEL_SERVICE_NAME,
    );
  }

  get aiSpeechServiceClient(): AiSpeechServiceClient {
    // 软负载均衡

    if (this.clients.length === 0) {
      throw new ServiceUnavailableException();
    }

    const randomIndex = Math.floor(Math.random() * this.clients.length);
    return this.clients[randomIndex].getService<AiSpeechServiceClient>(
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
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.aiChatModelServiceClient.createChatCompletion(
      dto,
      generateClsMetadata,
    );
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

    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.aiSpeechServiceClient.createTranscription(
      {
        buffer: file.buffer,
      },
      generateClsMetadata,
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
    @Body() createChatModelDto: CreateChatModelDto,
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.aiChatModelServiceClient.createChatModel(
      {
        ...createChatModelDto,
      },
      generateClsMetadata,
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
    @GenerateClsMetadata() generateClsMetadata,
    @Param('id') id: string,
  ) {
    return this.aiChatModelServiceClient.deleteChatModel(
      { id },
      generateClsMetadata,
    );
  }

  /**
   * 渠道用户获取会话模型列表
   */
  @Get('chat/model')
  @Auth('jwt')
  @ApiPaginatedResponse(ChatModelEntity)
  private async getChatModelList(
    @GenerateClsMetadata() generateClsMetadata,
    @Query() paginatedDto: PaginatedDto,
  ) {
    return this.aiChatModelServiceClient.getChatModelList(
      { ...paginatedDto },
      generateClsMetadata,
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
    @GenerateClsMetadata() generateClsMetadata,
    @Param('id') id: string,
  ) {
    return this.aiChatModelServiceClient.getChatModelById(
      { id },
      generateClsMetadata,
    );
  }

  /**
   * 渠道用户更新会话模型
   */
  @Patch('chat/model/:id')
  @Auth('jwt')
  @ApiBaseResponse()
  private async updateUser(
    @GenerateClsMetadata() generateClsMetadata,
    @Body() updateChatModelDto: UpdateChatModelDto,
  ) {
    return this.aiChatModelServiceClient.updateChatModel(
      {
        ...updateChatModelDto,
      },
      generateClsMetadata,
    );
  }
}
