import { Module } from '@nestjs/common';
import { GrokService } from './grok.service';

@Module({
  providers: [GrokService],
  exports: [GrokService]
})
export class GrokModule {}
