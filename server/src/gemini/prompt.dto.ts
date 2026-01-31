import { IsString } from "class-validator";

export class CreatePromptDto {
  @IsString()
  message: string;
}
