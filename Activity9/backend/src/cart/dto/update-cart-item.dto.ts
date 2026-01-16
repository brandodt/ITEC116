import { IsString, IsNumber, IsMongoId, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Product ID to update' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 3, description: 'New quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
