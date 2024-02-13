import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { Auth } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TimeBlockDto } from './dto/time-block.dto';

@Controller('user/time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string){
    return this.timeBlockService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: TimeBlockDto, @CurrentUser('id') userId: string){
    return this.timeBlockService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('update-order')
  @Auth()
  async updateOrder (@Body() updateOrderDto: UpdateOrderDto){
    return this.timeBlockService.updateOrder(updateOrderDto.ids)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(
    @Body() dto: TimeBlockDto,
    @CurrentUser('id') userId: string,
    @Param('id') timeBlockId: string
  ){
    return this.timeBlockService.update(dto, timeBlockId, userId)
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(
    @Param('id') timeBlockId: string,
  ){
    return this.timeBlockService.delete(timeBlockId)
  }
}
