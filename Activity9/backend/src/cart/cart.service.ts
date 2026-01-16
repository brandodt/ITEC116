import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Get or create cart for session
  async getOrCreateCart(sessionId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ sessionId }).exec();
    if (!cart) {
      cart = new this.cartModel({ sessionId, items: [] });
      await cart.save();
    }
    return cart;
  }

  // Get cart with populated product details
  async getCart(sessionId: string) {
    const cart = await this.cartModel.findOne({ sessionId }).exec();
    if (!cart || cart.items.length === 0) {
      return { items: [], subtotal: 0, itemCount: 0 };
    }

    // Populate product details
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productModel.findById(item.productId).exec();
        if (!product) return null;
        return {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image,
          },
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        };
      }),
    );

    const validItems = items.filter((item) => item !== null);
    const subtotal = validItems.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: validItems,
      subtotal,
      itemCount,
    };
  }

  // Add item to cart
  async addToCart(sessionId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Verify product exists and has stock
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock < quantity) {
      throw new BadRequestException(`Only ${product.stock} items available in stock`);
    }

    let cart = await this.cartModel.findOne({ sessionId }).exec();
    if (!cart) {
      cart = new this.cartModel({ sessionId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new BadRequestException(`Cannot add more. Only ${product.stock} items in stock`);
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();
    return this.getCart(sessionId);
  }

  // Update item quantity
  async updateCartItem(sessionId: string, updateCartItemDto: UpdateCartItemDto) {
    const { productId, quantity } = updateCartItemDto;

    const cart = await this.cartModel.findOne({ sessionId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    // Verify stock
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (quantity > product.stock) {
      throw new BadRequestException(`Only ${product.stock} items available in stock`);
    }

    item.quantity = quantity;
    await cart.save();
    return this.getCart(sessionId);
  }

  // Remove item from cart
  async removeFromCart(sessionId: string, productId: string) {
    const cart = await this.cartModel.findOne({ sessionId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    await cart.save();
    return this.getCart(sessionId);
  }

  // Clear entire cart
  async clearCart(sessionId: string) {
    await this.cartModel.findOneAndUpdate(
      { sessionId },
      { items: [] },
    ).exec();
    return { message: 'Cart cleared successfully', items: [], subtotal: 0, itemCount: 0 };
  }

  // Validate cart before checkout
  async validateCart(sessionId: string) {
    const cart = await this.cartModel.findOne({ sessionId }).exec();
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const issues: string[] = [];
    const validItems: Array<{ product: ProductDocument; quantity: number; subtotal: number }> = [];

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
        issues.push(`${product.name} only has ${product.stock} items in stock`);
        continue;
      }

      validItems.push({
        product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      });
    }

    const subtotal = validItems.reduce((sum, item) => sum + item.subtotal, 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      valid: issues.length === 0,
      issues,
      items: validItems,
      subtotal,
      shipping,
      tax,
      total,
    };
  }
}
