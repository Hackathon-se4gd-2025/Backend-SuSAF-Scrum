import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './modules/item';


@Module({
  imports: [   
     MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb+srv://admin:hyYFr82agsUAkXQx@susafscrum.xvvfz.mongodb.net/?retryWrites=true&w=majority&appName=SuSAFScrum'),
     ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
