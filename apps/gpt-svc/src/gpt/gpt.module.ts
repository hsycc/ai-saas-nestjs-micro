import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GptController } from './gpt.controller';
import { GPT } from './gpt.entity';
import { GptService } from './gpt.service';

@Module({
  imports: [TypeOrmModule.forFeature([GPT])],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}
