import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  // Create order from cart (checkout)
  async checkout(sessionId: string) {
    // Get cart
    const cart = await this.cartModel.findOne({ sessionId }).exec();
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate and prepare order items
    const orderItems: Array<{ productId: any; productName: string; price: number; quantity: number; image: string }> = [];
    let subtotal = 0;
    const issues: string[] = [];

    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId).exec();
      
      if (!product) {
        issues.push(`Product no longer exists`);
        continue;
      }

      if (!product.isActive) {
        issues.push(`${product.name} is no longer available`);
        continue;
      }

      if (product.stock === 0) {
        issues.push(`${product.name} is out of stock`);
        continue;
      }

      if (product.stock < item.quantity) {
        issues.push(`${product.name} only has ${product.stock} items in stock (requested: ${item.quantity})`);
        continue;
      }

      // All validations passed
      orderItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      subtotal += product.price * item.quantity;
    }

    // If there are issues, return them
    if (issues.length > 0) {
      throw new BadRequestException({
        message: 'Some items could not be processed',
        issues,
      });
    }

    if (orderItems.length === 0) {
      throw new BadRequestException('No valid items in cart');
    }

    // Calculate totals
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    // Create order
    const order = new this.orderModel({
      sessionId,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending',
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await this.productModel.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
      ).exec();
    }

    // Clear cart
    await this.cartModel.findOneAndUpdate(
      { sessionId },
      { items: [] },
    ).exec();

    return {
      message: 'Order placed successfully',
      order: this.formatOrder(order),
    };
  }

  // Get all orders for a session
  async findAll(sessionId: string) {
    const orders = await this.orderModel
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .exec();
    
    return orders.map((order) => this.formatOrder(order));
  }

  // Get single order
  async findOne(id: string, sessionId: string) {
    const order = await this.orderModel.findOne({ 
      _id: id, 
      sessionId 
    }).exec();
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrder(order);
  }

  // Update order status (admin)
  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status: updateOrderStatusDto.status },
      { new: true },
    ).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrder(order);
  }

  // Get order statistics
  async getStats(sessionId?: string) {
    const match = sessionId ? { sessionId } : {};
    
    const stats = await this.orderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
        },
      },
    ]).exec();

    const statusCounts = await this.orderModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]).exec();

    return {
      totalOrders: stats[0]?.totalOrders || 0,
      totalRevenue: Number((stats[0]?.totalRevenue || 0).toFixed(2)),
      avgOrderValue: Number((stats[0]?.avgOrderValue || 0).toFixed(2)),
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }

  // Helper to format order for response
  private formatOrder(order: OrderDocument) {
    return {
      _id: order._id,
      items: order.items.map((item) => ({
        product: {
          _id: item.productId,
          name: item.productName,
          price: item.price,
          image: item.image,
        },
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: order.status,
      createdAt: order['createdAt'],
      updatedAt: order['updatedAt'],
    };
  }
}
