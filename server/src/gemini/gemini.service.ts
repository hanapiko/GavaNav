// src/gemini/gemini.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { CreatePromptDto } from "./prompt.dto";

@Injectable()
export class GeminiService implements OnModuleInit {
  private ai: GoogleGenAI;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    // Initialize the new unified SDK
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateText(
    prompt: CreatePromptDto
  ): Promise<GenerateContentResponse> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt.message,
    });
    console.log("This is from gemini", response.text);

    return response;
  }
}
