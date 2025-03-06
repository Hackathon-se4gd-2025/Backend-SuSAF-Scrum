import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schemas/project';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>) {}

  // Create a new project
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = new this.projectModel(createProjectDto);
    return newProject.save();
  }

  // Get all projects
  async findAll(): Promise<Project[]> {
    return this.projectModel.find().populate('sprints items').exec();
  }

  // Get a single project by ID
  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).populate('sprints items').exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  // Update a project
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const updatedProject = await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
      runValidators: true,
    }).populate('sprints items');

    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return updatedProject;
  }

  // Delete a project
  async remove(id: string): Promise<void> {
    const result = await this.projectModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
// Fetch all items within a project
async findItemsByProject(projectId: string) {
    const project = await this.projectModel
      .findById(projectId)
      .populate({
        path: 'items', // Populate the items array
        model: 'Item'  // Ensure the model name matches the `Item` schema name
      })
      .exec();

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return project.items; // Return only the items array
  }
  
    // Fetch all sprints within a project
    async findSprintsByProject(projectId: string) {
        const project = await this.projectModel
          .findById(projectId)
          .populate({
            
            path: 'sprints', // Fetch full sprint details
            model: 'Sprint'
        })
          .exec();
    
        if (!project) {
          throw new NotFoundException(`Project with ID ${projectId} not found`);
        }
    
        return project.sprints; // Return only the sprints array
      }
}