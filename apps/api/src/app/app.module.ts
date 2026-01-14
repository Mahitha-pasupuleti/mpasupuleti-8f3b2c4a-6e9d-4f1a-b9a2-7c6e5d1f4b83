import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../tasks/task.module';
import { AuthModule } from '../app/auth/auth.module';
import { TaskEntity } from '../tasks/entity/task.entity';
import { UserEntity } from './auth/entity/user.entity';

@Module({
  imports: [
    TaskModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [TaskEntity, UserEntity],
      synchronize: true, // auto-create tables in dev
    }),
  ],
})
export class AppModule {}

