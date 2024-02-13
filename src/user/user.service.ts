import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';
import { UserDto } from './dto/user.dto';
import { startOfDay, subDays } from 'date-fns';
import { TaskService } from '../task/task.service';

@Injectable()
export class UserService {
  constructor(private task: TaskService, private prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        tasks: true
      }
    })
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async getIntervalCountsById(id:string){
    return this.prisma.user.findUnique({
      where:{
        id
      },
      select:{
        intervalsCount: true
      }
    })
  }

  async getProfile(id:string) {
    const profile = await this.getById(id)

    const totalTasks = profile.tasks.length

    const totalCompletedTasks = await this.task.isCompletedCount(id)

    const todayStart = startOfDay(new Date())
    const weekStart = startOfDay(subDays(new Date(), 7))

    const todayTasks = await this.task.todayTasksCount(id, todayStart)
    const weekTasks = await this.task.weekTasksCount(id, weekStart)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...rest} = profile

    // console.log(totalTasks, totalCompletedTasks, todayTasks, weekTasks)

    return{
      user: rest,
      statistics:[
        {label: 'Total', value: totalTasks},
        {label: 'Completed tasks', value: totalCompletedTasks},
        {label: 'Today tasks', value: todayTasks},
        {label: 'Week tasks', value: weekTasks}
      ]
    }
  }

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      name: 'Anonymous',
      password: await hash(dto.password)
    }



    return this.prisma.user.create({
      data: user
    })
  }

  async update(id:string, dto: UserDto) {
    let data = dto

    if(dto.password){
      data = {...dto, password: await hash(dto.password)}
    }

    return this.prisma.user.update({
      where: {
        id
      },
      data,
      select:{
        name: true,
        email: true
      }
    })
  }
}
