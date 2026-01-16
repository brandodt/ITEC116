import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty({ example: 'TKT-ABC123XYZ' })
  @IsNotEmpty()
  @IsString()
  qrCode: string;
}
