import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';

@Module({
  imports: [ConfigModule],
  providers: [GeminiService],
  controllers: [GeminiController]
})
export class GeminiModule {}
