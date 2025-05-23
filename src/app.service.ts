import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<'message', string> {
    return {
      message: 'Mingle Backend API',
    };
  }
}
