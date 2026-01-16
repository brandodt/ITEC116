import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Helper to get session ID (using header or default)
  private getSessionId(sessionHeader?: string): string {
    return sessionHeader || 'default-session';
  }

  @Get()
  @ApiOperation({ summary: 'Get cart contents' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiResponse({ status: 200, description: 'Returns cart with items and totals' })
  getCart(@Headers('x-session-id') sessionId?: string) {
    return this.cartService.getCart(this.getSessionId(sessionId));
  }

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  @ApiResponse({ status: 400, description: 'Invalid quantity or insufficient stock' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  addToCart(
    @Headers('x-session-id') sessionId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(this.getSessionId(sessionId), addToCartDto);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  @ApiResponse({ status: 400, description: 'Invalid quantity or insufficient stock' })
  @ApiResponse({ status: 404, description: 'Item not found in cart' })
  updateCartItem(
    @Headers('x-session-id') sessionId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(
      this.getSessionId(sessionId),
      updateCartItemDto,
    );
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiParam({ name: 'productId', description: 'Product ID to remove' })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  @ApiResponse({ status: 404, description: 'Item not found in cart' })
  removeFromCart(
    @Headers('x-session-id') sessionId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(this.getSessionId(sessionId), productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  clearCart(@Headers('x-session-id') sessionId?: string) {
    return this.cartService.clearCart(this.getSessionId(sessionId));
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate cart before checkout' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiResponse({ status: 200, description: 'Validation result with any issues' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  validateCart(@Headers('x-session-id') sessionId?: string) {
    return this.cartService.validateCart(this.getSessionId(sessionId));
  }
}
