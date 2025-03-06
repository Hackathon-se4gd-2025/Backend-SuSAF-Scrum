import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from '../services/project';
import { ProjectsController } from '../controllers/project';
import { Project, ProjectSchema } from '../schemas/project';

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectModule {}