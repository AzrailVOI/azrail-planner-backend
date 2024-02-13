import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { PomodoroRoundDto, PomodoroSessionDto } from './pomodoro.dto';

@Injectable()
export class PomodoroService {
  constructor(private prisma: PrismaService, private user: UserService) {}

  async getTodaySession(userId: string){
    const today = new Date().toISOString().split('T')[0]

    return this.prisma.pomodoroSession.findFirst({
      where: {
        createdAt: {
          gte: new Date(today)
        },
        userId
      },
      include:{
        rounds:{
          orderBy:{
            id: 'asc'
          }
        }
      }
    })
  }

  async create(userId:string) {
    const todaySession = await this.getTodaySession(userId)

    if(todaySession) return todaySession

    const user = await this.user.getIntervalCountsById(userId)

    if(!user) throw new NotFoundException('User not found')

    return this.prisma.pomodoroSession.create({
      data:{
        rounds:{
          createMany:{
            data: Array.from({length: user.intervalsCount}, ()=>({
              totalSeconds: 0
            }))
          }
        },
        user:{
          connect:{
            id: userId
          }
        }
      },
      include:{
        rounds: true
      }
    })


  }

  async update(dto: Partial<PomodoroSessionDto>, pomodoroId: string, userId: string) {
    console.log(dto, pomodoroId, userId)
    return this.prisma.pomodoroSession.update({
      where: {
        userId,
        id: pomodoroId
      },
      data: dto
    })
  }

  async updateRound(dto: Partial<PomodoroRoundDto>, roundId: string) {
    return this.prisma.pomodoroRound.update({
      where: {
        id: roundId
      },
      data: dto
    })
  }

  async deleteSession(sessionId: string, userId:string) {
    return this.prisma.pomodoroSession.delete({
      where: {
        id: sessionId,
        userId
      }
    })
  }
}
