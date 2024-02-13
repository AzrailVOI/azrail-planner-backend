import { Module } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { PomodoroController } from './pomodoro.controller';
import { PrismaService } from '../prisma.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PomodoroController],
  providers: [PomodoroService, PrismaService],
  exports: [PomodoroService]
})
export class PomodoroModule {}
