import { PomodoroSettingsDto } from './pomodoro-user.dto';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto extends PomodoroSettingsDto{
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @MinLength(6, {
    message: 'Password must be at least 6 characters',
  })
  @IsString()
  password?: string;
}
