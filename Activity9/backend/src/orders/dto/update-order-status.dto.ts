import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ 
    example: 'processing', 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    description: 'New order status'
  })
  @IsOptional()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status?: string;
}
