import { Controller, Inject } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(
    @Inject(GptService)
    private readonly service: GptService,
  ) {}
}
