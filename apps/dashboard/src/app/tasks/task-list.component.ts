import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service.js';
import { CreateTaskDTO } from '@ngtestwrk/data';
import { AuthService } from '../services/auth.service.js';

interface Task extends CreateTaskDTO {
  id: string; // backend provides unique ID
}

interface UserJWT {
  id: string;
  role: 'owner' | 'admin' | 'viewer';
  orgId: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './html/task-list.component.html',
  styleUrls: ['./css/task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Partial<CreateTaskDTO> = { title: '', description: '', status: 'todo' };
  user!: UserJWT;
  error = '';

  constructor(
    private taskService: TaskService,
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUser();
    this.loadTasks();
  }

  /** Load user info from JWT */
  private loadUser() {
    const user = this.auth.getUserFromToken();
    this.user = user || { id: '', role: 'viewer', orgId: '' };
  }

  /** Load all tasks from backend */
  private loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.cd.detectChanges(); // Fix ExpressionChangedAfterItHasBeenCheckedError
      },
      error: (err) => {
        this.error = 'Failed to load tasks: ' + (err.message || err.statusText);
        this.cd.detectChanges();
      }
    });
  }

  /** Permissions */
  canCreate(): boolean {
    return this.user.role === 'owner' || this.user.role === 'admin';
  }

  canUpdate(task: Task): boolean {
    return this.user.role === 'owner' || (this.user.role === 'admin' && task.orgId === this.user.orgId);
  }

  canDelete(task: Task): boolean {
    return this.user.role === 'owner' || (this.user.role === 'admin' && task.orgId === this.user.orgId);
  }

  /** Add new task */
  addTask() {
    if (!this.newTask.title?.trim()) return;

    const taskToAdd: Partial<CreateTaskDTO> = {
      title: this.newTask.title.trim(),
      description: this.newTask.description?.trim(),
      status: this.newTask.status || 'todo'
    };

    this.taskService.addTask(taskToAdd as CreateTaskDTO).subscribe({
      next: (task: Task) => {
        this.tasks.push(task);
        this.newTask = { title: '', description: '', status: 'todo' };
        this.error = '';
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to add task: ' + (err.message || err.statusText);
        this.cd.detectChanges();
      }
    });
  }

  /** Update task */
  updateTask(task: Task) {
    if (!this.canUpdate(task)) return;

    const newTitle = prompt('Update task title', task.title);
    if (!newTitle?.trim()) return;

    const updatedTask: Task = { ...task, title: newTitle.trim() };

    this.taskService.updateTask(updatedTask).subscribe({
      next: (res) => {
        const index = this.tasks.findIndex(t => t.id === res.id);
        if (index !== -1) this.tasks[index] = res;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to update task: ' + (err.message || err.statusText);
        this.cd.detectChanges();
      }
    });
  }

  /** Delete task */
  deleteTask(taskId: string) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !this.canDelete(task)) return;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to delete task: ' + (err.message || err.statusText);
        this.cd.detectChanges();
      }
    });
  }

  /** Get tasks by status for Jira-style columns */
  getTasksByStatus(status: 'todo' | 'in-progress' | 'done'): Task[] {
    return this.tasks.filter(t => t.status === status);
  }
}
