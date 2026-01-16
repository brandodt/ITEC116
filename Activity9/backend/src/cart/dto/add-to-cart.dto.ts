import { IsString, IsNumber, IsMongoId, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Product ID to add' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 1, description: 'Quantity to add' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
