import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO, UpdateTaskDTO, Role } from '@ngtestwrk/data';
import { JwtAuthGuard } from '../app/auth/jwt-auth.guard';
import { Roles } from '../app/auth/roles.decorator';
import { RolesGuard } from '../app/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** Create task (ADMIN / OWNER only) */
  @Post()
  @Roles(Role.ADMIN, Role.OWNER)
  async create(@Req() req, @Body() dto: CreateTaskDTO) {
    return this.taskService.createTask(dto, req.user);
  }

  /** Get all tasks (VIEWER / ADMIN / OWNER) */
  @Get()
  @Roles(Role.VIEWER, Role.ADMIN, Role.OWNER)
  async getAll(@Req() req) {
    return this.taskService.getTasks(req.user);
  }

  /** Update task (ADMIN / OWNER only) */
  @Put(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDTO, @Req() req) {
    return this.taskService.updateTask(id, dto, req.user);
  }

  /** Delete task (ADMIN / OWNER only) */
  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  async delete(@Param('id') id: string, @Req() req) {
    return this.taskService.deleteTask(id, req.user);
  }

  /** Get audit logs (ADMIN / OWNER only) */
  @Get('audit-log')
  @Roles(Role.ADMIN, Role.OWNER)
  async getAudit(@Req() req) {
    return this.taskService.getAuditLogs(req.user);
  }

  /** Get tasks filtered by category (VIEWER / ADMIN / OWNER) */
  @Get('by-category')
  @Roles(Role.VIEWER, Role.ADMIN, Role.OWNER)
  async getByCategory(
    @Req() req,
    @Query('category') category?: string
  ) {
    // If no category is provided, just return all tasks for the user
      if (!category) {
        return this.taskService.getTasks(req.user);
      }

    // Otherwise, filter by category
    return this.taskService.getTasksByCategory(req.user, category);
  }

}


/*
| Role   | Can Create Task       | Can Read Tasks           | Can Update Task         | Can Delete Task         |
| ------ | --------------------- | ------------------------ | ----------------------- | ----------------------- |
| OWNER  | Only in **their org** | All tasks (across orgs?) | Any task (all orgs)     | Any task (all orgs)     |
| ADMIN  | Only in **their org** | Only tasks in their org  | Only tasks in their org | Only tasks in their org |
| VIEWER | **Cannot create**     | Only tasks in their org  | Cannot update           | Cannot delete           |

*/