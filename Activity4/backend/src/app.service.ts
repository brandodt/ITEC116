import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Weather Proxy API is running! Visit /api for documentation.';
  }
}
