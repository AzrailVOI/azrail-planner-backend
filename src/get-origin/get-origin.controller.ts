import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
@Controller('get-origin')
export class GetOriginController {
  @Get()
  getDomain(@Req() request: Request) {
    const host = request.headers.host;
    const origin = request.headers.origin;

    console.log('Host:', host);
    console.log('Origin:', origin);

    // Далее обработка вашего запроса и возвращение ответа
  }
}
