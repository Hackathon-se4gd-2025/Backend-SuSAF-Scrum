import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../schemas/item';
import { CreateItemDto, UpdateItemDto } from '../dtos/item';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private readonly itemModel: Model<Item>) {}

  // Create a new item
  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = new this.itemModel(createItemDto);
    return newItem.save();
  }

  // Get all items
  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  // Get a single item by ID
  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  // Update an item
  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const updatedItem = await this.itemModel.findByIdAndUpdate(id, updateItemDto, {
      new: true, // Return the updated document
      runValidators: true,
      timestamps: true,
    });

    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  // Delete an item
  async remove(id: string): Promise<void> {
    const result = await this.itemModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }
}