import { IsBoolean, IsNumber, IsOptional } from 'class-validator';


export class PomodoroSessionDto {
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean;
}

export class PomodoroRoundDto {
  @IsOptional()
  @IsBoolean()
  isCompleted: boolean;

  @IsNumber()
  totalSeconds: number;
}
