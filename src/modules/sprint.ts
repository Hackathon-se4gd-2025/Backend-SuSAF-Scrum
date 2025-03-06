import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SprintsService } from '../services/sprint';
import { SprintsController } from '../controllers/sprint';
import { Sprint, SprintSchema } from '../schemas/sprint';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }])],
  controllers: [SprintsController],
  providers: [SprintsService],
})
export class SprintsModule {}