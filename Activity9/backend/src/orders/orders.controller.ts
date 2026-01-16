import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Headers,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Helper to get session ID
  private getSessionId(sessionHeader?: string): string {
    return sessionHeader || 'default-session';
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout and create order from cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Cart is empty or validation failed' })
  checkout(@Headers('x-session-id') sessionId?: string) {
    return this.ordersService.checkout(this.getSessionId(sessionId));
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for current session' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiResponse({ status: 200, description: 'Returns list of orders' })
  findAll(@Headers('x-session-id') sessionId?: string) {
    return this.ordersService.findAll(this.getSessionId(sessionId));
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier (optional)' })
  @ApiResponse({ status: 200, description: 'Returns order statistics' })
  getStats(@Headers('x-session-id') sessionId?: string) {
    return this.ordersService.getStats(sessionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session identifier' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Returns the order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(
    @Param('id') id: string,
    @Headers('x-session-id') sessionId?: string,
  ) {
    return this.ordersService.findOne(id, this.getSessionId(sessionId));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
