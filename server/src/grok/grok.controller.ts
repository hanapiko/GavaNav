import { Controller } from "@nestjs/common";
import { Post, Body } from "@nestjs/common";
import { GrokService } from "./grok.service";
import { CreatePromptDto } from "../gemini/prompt.dto";

@Controller("grok")
export class GrokController {
    constructor(private readonly grockService: GrokService) {}
  @Post()
  async chat(@Body() createPromptDto: CreatePromptDto) {
    console.log("🔥 POST /chat endpoint hit!");
    console.log("📝 Request body:", createPromptDto);
    const response = await this.grockService.generateText(createPromptDto);
    console.log("✅ Response generated");
    return { response };
  }
}
