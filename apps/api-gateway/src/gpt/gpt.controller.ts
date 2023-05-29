/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:03:20
 * @LastEditTime: 2023-05-27 20:27:03
 * @Description:
 *
 */
import { Controller, OnModuleInit, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
@ApiTags('gpt')
@Controller('gpt')
export class GptController implements OnModuleInit {
  constructor() {}

  public onModuleInit(): void {}

  /**
   * 列出当前可用的型号，并提供每个型号的基本信息，如所有者和可用性。
   */
  @Get('models')
  @Auth()
  private async listModels() {
    //
  }

  /**
   * 检索模型实例，提供有关模型的基本信息，如所有者和权限
   */
  @Get('models/:model')
  private async retrieveModel() {
    //
  }

  /**
   * 托管训练文件到gpt
   * 可以搭建服务器自己训练微调模型
   */
  @Post('files')
  private async uploadFile() {
    //
  }

  // https://platform.openai.com/docs/guides/fine-tuning/fine-tuning
  /**
   * 创建微调模型
   * 可以指定训练托管到gpt的训练文件
   *
   */
  @Post('fine_tune/create')
  private async createModel() {
    //
  }

  /**
   * 上传数据集训练指定微调模型
   */
  @Post('fine_tune/prepare_data')
  private async CreateModel() {
    //
  }

  /**
   * 删除微调模型
   */
  @Post('fine_tune/delete')
  private async deleteModel() {
    //
  }

  /**
   * 指定模型对话, 如果指定了微调模型，可以同时训练该模型。
   * text-davinci-003 令牌价格 比 gpt-3.5-turbo 贵 10%。
   * gpt-3.5-turbo 模型不可微调
   */
  @Post('completions')
  private async completions() {
    //
  }

  /**
   * 多回合对话, 可以指定我们自定义的人物风格对话
   * gpt-3.5-turbo, gpt-4
   *
   */
  @Post('chat/completions')
  private async chatCompletions() {
    //
  }

  /**
   * 文本编辑, 为提供的输入、指令和参数创建新的编辑。
   */
  @Post('edits')
  private async createEdit() {
    //
  }

  /**
   * 图像生成
   */
  @Post('images/generations')
  private async createImage() {
    //
  }

  /**
   * 图像编辑
   * 在给定原始图像和提示的情况下，创建经过编辑或扩展的图像。
   */
  @Post('images/edit')
  private async createImageEdit() {
    //
  }

  /**
   * 创建给定图像的变体。.
   */
  @Post('images/variations')
  private async createImageVariation() {
    //
  }

  /**
   * 将音频转录为输入语言。
   */
  @Post('audio/transcriptions')
  private async createTranscription() {
    //
  }

  /**
   * 语音翻译成文本， 目前只支持英语
   */
  @Post('audio/translations')
  private async createTranslation() {
    //
  }

  /**
   * 给定文本输入向量供机器模型学习
   */
  @Post('embeddings')
  private async createEmbedding() {
    //
  }

  /**
   * 检索是否违反OpenAI的内容策略
   */
  @Post('moderations')
  private async createModeration() {
    //
  }
}
