# Task Management Dashboard

This repository is an **NX-based monorepo** containing a backend API and a frontend dashboard application, with shared libraries for data contracts and domain models.

---

## 1. Setup Instructions

### Prerequisites

* Node.js >= 18
* npm or yarn
* NX CLI (optional)
* PostgreSQL / MongoDB (based on your DB choice)

```bash
npm install -g nx
```

### Install Dependencies

From the repository root:

```bash
npm install
```

---

### Running the Backend (API)

```bash
npx nx serve api
```

Backend will start at:

```
http://localhost:3000
```

---

### Running the Frontend (Dashboard)

```bash
npx nx serve dashboard
```

Frontend will start at:

```
http://localhost:4200
```

---

## 2. Architecture Overview

### NX Monorepo Layout

```
apps/
  api/         → Backend (NestJS)
  dashboard/   → Frontend (Angular)

libs/
  data/        → Shared DTOs, enums, interfaces
```

### Why NX?

* Enforced module boundaries
* Shared libraries without duplication
* Independent builds & caching
* Scales well for large teams

---

### Shared Libraries

#### `libs/data`

Single source of truth for:

* DTOs (request/response contracts)
* Enums (roles, statuses)
* Interfaces (User, Task, Organization)

Used by both:

* `apps/api`
* `apps/dashboard`

This ensures **type safety across frontend and backend**.

---

## 3. Data Model Explanation

### Core Entities

* **User**
* **Organization**
* **Role**
* **Permission**
* **Task**

### Relationships

* A **User** belongs to one **Organization**
* An **Organization** has many **Users**
* A **User** has one **Role** per organization
* A **Role** maps to multiple **Permissions**
* **Tasks** are scoped to an organization

### ERD (Conceptual)

```
User ──── belongs to ──── Organization
 │                               │
 │ has                           │ has
 ▼                               ▼
 Role ──── maps to ──── Permission
```

---

## 4. Access Control Implementation

### Roles

* `OWNER`
* `ADMIN`
* `VIEWER`

### Permissions (examples)

* `TASK_CREATE`
* `TASK_READ`
* `TASK_UPDATE`
* `TASK_DELETE`

### Organization Hierarchy

* **OWNER**: Full control, manages org & roles
* **ADMIN**: Manage tasks within the org
* **VIEWER**: Read-only access of tasks

---

### JWT Authentication Flow

1. User logs in with credentials
2. Backend issues a **JWT** containing:

   * `userId`
   * `orgId`
   * `role`
3. JWT is sent in `Authorization` header

```http
Authorization: Bearer <token>
```

4. Guards validate:

   * Token authenticity
   * User role
   * Required permissions

---

## 5. API Documentation

### Auth

#### POST `/api/auth/login`

**Request**

```json
{
  "email": "user@example.com",
}
```

**Response**

```json
{
  "accessToken": "jwt-token",
}
```

---

### Tasks

#### GET `/api/tasks`

**Response**

```json
[
  {
    "id": "uuid",
    "title": "Sample Task",
    "status": "todo",
    "description": "Sample Task",
    "owner": "owner name",
    "category": "Work"
  }
]
```

---

#### POST `/api/tasks`

**Request**

```json
{
  "title": "New Task",
  "description": "Task description",
  "category": "Work",
  "status": "todo"
}
```
---

#### PUT `/api/tasks/:id`

**Request**

```json
{
  "title": "New Task",
}
```
**Response**

```json
"Task Updated Successfully"
```
---

#### DELETE `/api/tasks/:id`

**Response**

```json
"Task Deleted Successfully"
```
---

#### POST `/api/auth/register`

**Request**

```json
{
  "name": "sample",
  "email": "sample@example.com",
  "role": "VIEWER",
  "orgId": "sample"
}
```
---

#### GET `/api/tasks/by-category?category=Personal`

**Response**

```json
[
    {
        "id": "91627c21-b751-4922-99ce-d9b3328e9b22",
        "title": "Draft Document",
        "description": "Do by Monday",
        "category": "Personal",
        "status": "todo",
        "ownerId": "4c8616b3-620f-4038-9547-0cd3c771bdcb",
        "orgId": "org1"
    }
]
```
---

## 6. Role Delegation

| Role   | Can Create Task       | Can Read Tasks           | Can Update Task         | Can Delete Task         |
| ------ | --------------------- | ------------------------ | ----------------------- | ----------------------- |
| OWNER  | Only in **their org** | All tasks (across orgs?) | Any task (all orgs)     | Any task (all orgs)     |
| ADMIN  | Only in **their org** | Only tasks in their org  | Only tasks in their org | Only tasks in their org |
| VIEWER | **Cannot create**     | Only tasks in their org  | Cannot update           | Cannot delete           |

---

## 7. Sample Users

```javascript
const users = [
    { name: 'Alice', email: 'alice@example.com', role: Role.OWNER, orgId: 'org1' },
    { name: 'Bob', email: 'bob@example.com', role: Role.ADMIN, orgId: 'org1' },
    { name: 'Charlie', email: 'charlie@example.com', role: Role.VIEWER, orgId: 'org1' },
    { name: 'Dave', email: 'dave@example.com', role: Role.OWNER, orgId: 'org2' },
    { name: 'Eve', email: 'eve@example.com', role: Role.ADMIN, orgId: 'org2' },
    { name: 'Frank', email: 'frank@example.com', role: Role.VIEWER, orgId: 'org2' },
    { name: 'Grace', email: 'grace@example.com', role: Role.OWNER, orgId: 'org3' },
    { name: 'Heidi', email: 'heidi@example.com', role: Role.VIEWER, orgId: 'org3' },
  ];
```
---

## 8. Future Considerations

### Advanced Role Delegation

* Custom roles per organization
* Temporary permissions
* Role inheritance

### Production-Ready Security

* JWT refresh tokens
* Token rotation
* CSRF protection
* Secure cookies

### RBAC Performance & Scaling

* Permission caching (Redis)
* Policy-based access control
* Database indexing on role/permission tables

---

## 9. Summary

This monorepo architecture ensures:

* Clear separation of concerns
* Shared contracts between frontend and backend
* Scalable access control model
* Production-ready foundation
