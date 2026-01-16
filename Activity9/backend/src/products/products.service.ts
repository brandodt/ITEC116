import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Seed initial products if database is empty
  async onModuleInit() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      await this.seedProducts();
    }
  }

  private async seedProducts() {
    const seedData: CreateProductDto[] = [
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation',
        price: 79.99,
        stock: 15,
        category: 'Electronics',
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring',
        price: 199.99,
        stock: 8,
        category: 'Electronics',
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt in various colors',
        price: 29.99,
        stock: 50,
        category: 'Clothing',
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes for athletes',
        price: 89.99,
        stock: 3,
        category: 'Sports',
      },
      {
        name: 'Desk Lamp',
        description: 'Modern LED desk lamp with adjustable brightness',
        price: 45.99,
        stock: 25,
        category: 'Home',
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat for home workouts',
        price: 34.99,
        stock: 0,
        category: 'Sports',
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 129.99,
        stock: 12,
        category: 'Home',
      },
      {
        name: 'JavaScript Book',
        description: 'Complete guide to modern JavaScript',
        price: 49.99,
        stock: 20,
        category: 'Books',
      },
      {
        name: 'Denim Jacket',
        description: 'Classic denim jacket for all seasons',
        price: 79.99,
        stock: 5,
        category: 'Clothing',
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable speaker with 360° sound',
        price: 59.99,
        stock: 18,
        category: 'Electronics',
      },
      {
        name: 'Plant Pot Set',
        description: 'Set of 3 ceramic plant pots',
        price: 24.99,
        stock: 30,
        category: 'Home',
      },
      {
        name: 'Basketball',
        description: 'Official size basketball',
        price: 39.99,
        stock: 2,
        category: 'Sports',
      },
    ];

    await this.productModel.insertMany(seedData);
    console.log('🌱 Products seeded successfully');
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(category?: string, search?: string): Promise<Product[]> {
    const query: any = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    return this.productModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return { message: `Product "${result.name}" deleted successfully` };
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    product.stock = Math.max(0, product.stock - quantity);
    return product.save();
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category', { isActive: true });
    return ['All', ...categories.sort()];
  }
}
