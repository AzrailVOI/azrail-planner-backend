import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskDto } from './task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async isCompletedCount(id:string) {
    return this.prisma.task.count({
      where: {
        userId: id,
        isCompleted: true
      }
    })
  }

  async todayTasksCount(id:string, todayStart:Date) {
    return this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: todayStart.toISOString()
        },
        isCompleted: false
      }
    })
  }

  async weekTasksCount(id:string, weekStart:Date) {
    return this.prisma.task.count({
      where: {
        userId: id,
        createdAt: {
          gte: weekStart.toISOString()
        },
        isCompleted: false
      }
    })
  }

  async create(dto: TaskDto, userId:string) {

    return this.prisma.task.create({
      data: {
        ...dto,
        user:{
          connect:{
            id: userId
          }
        }
        // createdAt:new Date(new Date().setDate(new Date().getDate()))
      }
    })
  }

  async update( dto: Partial<TaskDto>, taskId: string, userId: string) {
    return this.prisma.task.update({
      where: {
        userId,
        id: taskId
      },
      data: dto
    })
  }

  async delete(taskId: string) {
    return this.prisma.task.delete({
      where: {
        id: taskId
      }
    })
  }

  async getAll(userId: string){
    return this.prisma.task.findMany({
      where: {
        userId
      }
    })
  }
}
