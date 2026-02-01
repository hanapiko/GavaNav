import { IsString } from "class-validator";

export class CreatePromptDto {
  @IsString()
  county: string;

  @IsString()
  service: string;

  @IsString()
  age: string;

  @IsString()
  residency: string;

  @IsString()
  applicationType: string;
}
