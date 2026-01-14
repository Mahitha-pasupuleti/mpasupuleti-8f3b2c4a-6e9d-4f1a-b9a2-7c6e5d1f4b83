// apps/api/src/tasks/task.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity]), // <- This is critical
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}