import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import * as cors from 'cors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors({
        origin: 'https://tasktrackify.netlify.app', // Update with your frontend's URL
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      }))
      .forRoutes('*');
  }
}
