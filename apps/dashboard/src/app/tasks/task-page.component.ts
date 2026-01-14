import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service.js';
import { AuthService } from '../services/auth.service.js';
import { CreateTaskDTO } from '@ngtestwrk/data';
import { Task } from '../services/task.service.js';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './html/task-page.component.html',
  styleUrls: ['./css/task-page.component.css']
})
export class TasksPageComponent implements OnInit {
  tasks: Task[] = [];

  newTask: CreateTaskDTO = { title: '', description: '', ownerId: '', orgId: '', category: 'Work' };
  editingTask: Task | null = null;
  selectedCategory: '' | 'Work' | 'Personal' = '';
  success = '';
  error = '';

  categories: Array<'Work' | 'Personal'> = ['Work', 'Personal'];
  statuses: Array<'todo' | 'in-progress' | 'done'> = ['todo', 'in-progress', 'done'];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  /** Load tasks (with optional category filter) */
  loadTasks() {
    const obs = this.selectedCategory
      ? this.taskService.getTasksByCategory(this.selectedCategory)
      : this.taskService.getTasks();

    obs.subscribe({
      next: data => this.tasks = data.map(t => ({ ...t, status: t.status || 'todo' })),
      error: err => this.error = 'Failed to load tasks: ' + (err.message || err.statusText)
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category as any;
    this.loadTasks();
  }

  addTask() {
    if (!this.newTask.title?.trim() || !this.newTask.category) return;

    this.taskService.addTask(this.newTask).subscribe({
      next: task => {
        this.tasks.push({ ...task, status: task.status || 'todo' });
        this.newTask = { title: '', description: '', ownerId: '', orgId: '', category: 'Work' };
        this.success = 'Task added successfully!';
        this.error = '';
      },
      error: err => {
        this.error = 'Failed to add task: ' + (err.message || err.statusText);
        this.success = '';
      }
    });
  }

  startEdit(task: Task) {
    this.editingTask = { ...task };
  }

  updateTask() {
    if (!this.editingTask || !this.editingTask.id) return;

    this.taskService.updateTask(this.editingTask).subscribe({
      next: updated => {
        const idx = this.tasks.findIndex(t => t.id === updated.id);
        if (idx > -1) this.tasks[idx] = { ...updated };
        this.editingTask = null;
        this.success = 'Task updated successfully!';
        this.error = '';
      },
      error: err => {
        this.error = 'Failed to update task: ' + (err.message || err.statusText);
        this.success = '';
      }
    });
  }

  updateTaskStatus(task: Task) {
    if (!task.id) return;

    this.taskService.updateTask(task).subscribe({
      next: updated => {
        const idx = this.tasks.findIndex(t => t.id === updated.id);
        if (idx > -1) this.tasks[idx] = { ...updated };
      },
      error: err => {
        this.error = 'Failed to update status: ' + (err.message || err.statusText);
      }
    });
  }

  cancelEdit() { this.editingTask = null; }

  removeTask(id?: string) {
    if (!id) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.success = 'Task deleted!';
        this.error = '';
      },
      error: err => {
        this.error = 'Failed to delete task: ' + (err.message || err.statusText);
        this.success = '';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
