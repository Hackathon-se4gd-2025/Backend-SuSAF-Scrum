import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ItemsService } from '../services/items';
import { CreateItemDto, UpdateItemDto } from '../dtos/item';
import { Item } from '../schemas/item';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): Promise<Item> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.itemsService.remove(id);
  }
}