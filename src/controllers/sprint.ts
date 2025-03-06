import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SprintsService } from '../services/sprint';
import { CreateSprintDto, UpdateSprintDto } from '../dtos/sprint';
import { Sprint } from '../schemas/sprint';

@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  async create(@Body() createSprintDto: CreateSprintDto): Promise<Sprint> {
    return this.sprintsService.create(createSprintDto);
  }

  @Get()
  async findAll(): Promise<Sprint[]> {
    return this.sprintsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sprint> {
    return this.sprintsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto): Promise<Sprint> {
    return this.sprintsService.update(id, updateSprintDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.sprintsService.remove(id);
  }

  @Get(':id/items')
  async findItems(@Param('id') id: string) {
    return this.sprintsService.findItemsBySprint(id);
  }
}