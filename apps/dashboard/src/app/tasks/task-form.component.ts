import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service.js';
import { CreateTaskDTO } from '@ngtestwrk/data';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Create New Task</h2>

    <form (ngSubmit)="addTask()" #taskForm="ngForm">
      <input
        name="title"
        [(ngModel)]="newTask.title"
        placeholder="Task Title"
        required
      />
      <input
        name="description"
        [(ngModel)]="newTask.description"
        placeholder="Description"
      />
      <input
        name="ownerId"
        [(ngModel)]="newTask.ownerId"
        placeholder="Owner ID"
      />
      <input
        name="orgId"
        [(ngModel)]="newTask.orgId"
        placeholder="Organization ID"
      />
      <button type="submit" [disabled]="!taskForm.form.valid">Add Task</button>
    </form>

    <p *ngIf="success" style="color:green">{{ success }}</p>
    <p *ngIf="error" style="color:red">{{ error }}</p>
  `
})
export class TaskFormComponent {
  newTask: CreateTaskDTO = { title: '', description: '', ownerId: '', orgId: '' };
  success = '';
  error = '';

  constructor(private taskService: TaskService, private router: Router) {}

  addTask() {
    if (!this.newTask.title?.trim()) return;

    this.taskService.addTask(this.newTask).subscribe({
      next: (task) => {
        this.success = 'Task created successfully!';
        this.error = '';
        this.newTask = { title: '', description: '', ownerId: '', orgId: '' };
        // Navigate to task list after creation
        setTimeout(() => this.router.navigate(['/tasks']), 500);
      },
      error: (err) => {
        this.error = 'Failed to create task: ' + (err.message || err.statusText);
        this.success = '';
      }
    });
  }
}
