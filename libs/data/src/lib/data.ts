// Shared DTOs and interfaces for Tasks and Users

// Task-related DTOs
export interface CreateTaskDTO {
  title: string;
  description?: string;
  category?: 'Work' | 'Personal';
  status?: 'todo' | 'in-progress' | 'done';
  ownerId?: string;
  orgId?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
}

// User-related DTOs
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string;
}

// Optional: Enum for task status
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export enum Permission {
  CREATE_TASK = 'CREATE_TASK',
  READ_TASK = 'READ_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  VIEW_AUDIT = 'VIEW_AUDIT',
}