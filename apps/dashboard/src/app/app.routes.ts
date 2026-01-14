import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component.js';
import { RegisterComponent } from './register/register.component.js';
import { TasksPageComponent } from './tasks/task-page.component.js';
import { TaskFormComponent } from './tasks/task-form.component.js';
import { AuthGuard } from './guards/auth.guard.js';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Tasks CRUD routes
  { path: 'tasks', component: TasksPageComponent, canActivate: [AuthGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [AuthGuard] },

  // fallback
  { path: '**', redirectTo: '/tasks' },
];

