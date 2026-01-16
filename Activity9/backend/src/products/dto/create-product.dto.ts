import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Headphones', description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Premium wireless headphones with noise cancellation', description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 79.99, description: 'Product price in USD' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 15, description: 'Available stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'Product image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether product is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
