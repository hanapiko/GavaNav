import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class GrokService {
    constructor(private configService: ConfigService) {}    
   
    private groq = new OpenAI({
        apiKey: this.configService.get<string>('GROK_API_KEY'),
        baseURL: "https://api.groq.com/openai/v1", 
      });
    
      async generateText(dto: any): Promise<any> {
        const completion = await this.groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "You are GavaNav, an expert in Kenyan government services. Use a professional and patriotic tone." 
            },
            { 
              role: "user", 
              content: `County: ${dto.county}, Service: ${dto.service}. Question: ${dto.message}` 
            }
          ],
          temperature: 0.2,
        });
    
        return {
          reply: completion.choices[0].message.content,
          timestamp: new Date(),
        };
      }
}
