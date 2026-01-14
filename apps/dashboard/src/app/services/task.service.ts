import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service.js';
import { Observable } from 'rxjs';
import { CreateTaskDTO } from '@ngtestwrk/data';

export interface Task extends CreateTaskDTO {
  id: string; // backend assigns unique ID
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl, this.auth.getAuthHeaders());
  }

  // Get tasks filtered by category
  getTasksByCategory(category: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.baseUrl}/by-category?category=${category}`,
      this.auth.getAuthHeaders()
    );
  }

  // Add a task
  addTask(task: CreateTaskDTO): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task, this.auth.getAuthHeaders());
  }

  // Delete a task by id
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.auth.getAuthHeaders());
  }

  // Update a task
  updateTask(task: Task): Observable<Task> {
    if (!task.id) throw new Error('Task id is required to update');
    return this.http.put<Task>(
      `${this.baseUrl}/${task.id}`,
      task,
      this.auth.getAuthHeaders()
    );
  }
}
