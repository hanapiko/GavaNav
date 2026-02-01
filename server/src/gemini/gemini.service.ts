import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from "@google/genai"; // Using the newer SDK
import { CreatePromptDto } from "./prompt.dto";

@Injectable()
export class GeminiService implements OnModuleInit {
  private ai: GoogleGenAI;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateText(dto: CreatePromptDto): Promise<any> {
    // In this SDK, system instructions are passed within the generateContent call
    const response = await this.ai.models.generateContent({
      model: "gemini-1.5-flash-001", // Use a stable model version
      
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
      USER CONTEXT:
      - County: ${dto.county || "Not specified"}
      - Service: ${dto.service || "General Inquiry"}
      - Age: ${dto.age || "Not specified"}
      - Residency: ${dto.residency || "Not specified"}
      - Application Type: ${dto.applicationType || "Standard"}

      USER QUESTION:
      

      Please provide a step-by-step guide including:
      1. Required Documents (e.g., ID, KRA Pin, Passport photos).
      2. The Digital Process (eCitizen steps).
      3. The Physical Process (Huduma Centre or specific Ministry office).
      4. Estimated Costs & Timeline.`,
            },
          ],
        },
      ],
      config: {
        temperature: 0.3, 
        systemInstruction: `You are 'GavaNav', a specialized AI guide for Kenyan Government Services (Gava).
          Your goal is to simplify bureaucratic processes for citizens.
          
          RULES:
          - Always mention specific Kenyan platforms like eCitizen, NTSA (TIMS), or KRA iTax where relevant.
          - Use a helpful, professional, and patriotic tone.
          - If the service requires a physical visit (e.g., Huduma Centre), specify that.
          - Keep information current to Kenyan laws and regulations.`,
      }
    });

    return {
      reply: response.text, // The new SDK uses .text directly, not a function .text()
      timestamp: new Date(),
    };
  }
}
