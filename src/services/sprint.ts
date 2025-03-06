import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sprint } from '../schemas/sprint';
import { CreateSprintDto, UpdateSprintDto } from '../dtos/sprint';

@Injectable()
export class SprintsService {
  constructor(@InjectModel(Sprint.name) private readonly sprintModel: Model<Sprint>) {}

  // Create a new sprint
  async create(createSprintDto: CreateSprintDto): Promise<Sprint> {
    const newSprint = new this.sprintModel(createSprintDto);
    return newSprint.save();
  }

  // Get all sprints
  async findAll(): Promise<Sprint[]> {
    return this.sprintModel.find().populate('items').exec();
  }

  // Get a single sprint by ID
  async findOne(id: string): Promise<Sprint> {
    const sprint = await this.sprintModel.findById(id).populate('items').exec();
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  // Update a sprint
  async update(id: string, updateSprintDto: UpdateSprintDto): Promise<Sprint> {
    const updatedSprint = await this.sprintModel.findByIdAndUpdate(id, updateSprintDto, {
      new: true,
      runValidators: true,
    }).populate('items');

    if (!updatedSprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return updatedSprint;
  }

  // Delete a sprint
  async remove(id: string): Promise<void> {
    const result = await this.sprintModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
  }

  async findItemsBySprint(sprintId: string) {
    const sprint = await this.sprintModel
      .findById(sprintId)
      .populate({
        path: 'items', // Populate the items array
        model: 'Item'  // Ensure the model name matches the `Item` schema name
      })
      .exec();
    
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
    }

    return sprint.items; // Return full item objects
  }
}