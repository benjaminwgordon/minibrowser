import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Length,
} from "class-validator";

export default class RecipeStepDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  paintId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  toolId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  techniqueId: number;

  @IsNotEmpty()
  @Length(0, 80)
  instruction: string;
}
