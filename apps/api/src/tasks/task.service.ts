import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entity/task.entity';
import { UserEntity } from '../app/auth/entity/user.entity';
import { CreateTaskDTO, UpdateTaskDTO, UserDTO, Role } from '@ngtestwrk/data';

@Injectable()
export class TaskService {
  private auditLogs: any[] = []; // simple in-memory audit logs

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
  ) {}

  /** Create a task */
  async createTask(dto: CreateTaskDTO, user: UserDTO) {
    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('VIEWER cannot create tasks');
    }

    dto.ownerId = user.id;
    dto.orgId = user.orgId;

    const task = this.taskRepo.create({ ...dto, status: dto.status || 'todo' });
    await this.taskRepo.save(task);
    this.logAction(user.id, 'CREATE_TASK', task.id);

    // Load owner relation for frontend
    await this.taskRepo.findOne({ where: { id: task.id }, relations: ['owner'] });
    return this.getTaskWithUsername(task);
  }

  /** Get all tasks */
  async getTasks(user: UserDTO) {
    const query = this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.owner', 'owner');

    if (user.role !== Role.OWNER) {
      query.where('task.orgId = :orgId', { orgId: user.orgId });
    }

    const tasks = await query.getMany();
    return tasks.map(this.getTaskWithUsername);
  }

  /** Get tasks filtered by category */
  async getTasksByCategory(user: UserDTO, category: string) {
    if (!category) throw new Error('Category is required');

    let query = this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.owner', 'owner')
      .where('task.category = :category', { category });

    if (user.role !== Role.OWNER) {
      query.andWhere('task.orgId = :orgId', { orgId: user.orgId });
    }

    const tasks = await query.getMany();
    return tasks.map(this.getTaskWithUsername);
  }

  /** Update a task */
  async updateTask(id: string, dto: UpdateTaskDTO, user: UserDTO) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!task) throw new NotFoundException('Task not found');

    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('VIEWER cannot update tasks');
    }
    if (user.role === Role.ADMIN && task.orgId !== user.orgId) {
      throw new ForbiddenException('ADMIN cannot update tasks from other organizations');
    }

    Object.assign(task, dto);
    await this.taskRepo.save(task);
    this.logAction(user.id, 'UPDATE_TASK', task.id);
    return this.getTaskWithUsername(task);
  }

  /** Delete a task */
  async deleteTask(id: string, user: UserDTO) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    if (user.role === Role.VIEWER) {
      throw new ForbiddenException('VIEWER cannot delete tasks');
    }
    if (user.role === Role.ADMIN && task.orgId !== user.orgId) {
      throw new ForbiddenException('ADMIN cannot delete tasks from other organizations');
    }

    await this.taskRepo.remove(task);
    this.logAction(user.id, 'DELETE_TASK', id);
    return { message: 'Task deleted' };
  }

  /** Get audit logs */
  getAuditLogs(user: UserDTO) {
    if (user.role !== Role.OWNER && user.role !== Role.ADMIN)
      throw new ForbiddenException('Not allowed');
    return this.auditLogs;
  }

  /** Log actions in-memory */
  private logAction(userId: string, action: string, resourceId: string) {
    const log = { userId, action, resourceId, timestamp: new Date().toISOString() };
    this.auditLogs.push(log);
    console.log(log);
  }

  /** Helper: return task with username included */
  private getTaskWithUsername(task: TaskEntity) {
    return {
      ...task,
      username: task.owner?.name || 'Unknown',
    };
  }
}