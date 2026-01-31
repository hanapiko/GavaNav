import { Controller, Post, Body } from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { CreatePromptDto } from "./prompt.dto";

@Controller("gemini")
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  async chat(@Body() createPromptDto: CreatePromptDto) {
    console.log("🔥 POST /chat endpoint hit!");
    console.log("📝 Request body:", createPromptDto);
    const response = await this.geminiService.generateText(createPromptDto);
    console.log("✅ Response generated");
    return { response };
  }
}
