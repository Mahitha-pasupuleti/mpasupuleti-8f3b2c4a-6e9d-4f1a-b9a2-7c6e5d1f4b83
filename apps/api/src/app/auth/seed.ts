// apps/api/src/app/auth/seed.ts
import { DataSource } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { Role } from '@ngtestwrk/data';

export async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(UserEntity);

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

  for (const u of users) {
    const exists = await repo.findOne({ where: { email: u.email } });
    if (!exists) await repo.save(repo.create(u));
  }

  console.log('Seeded initial users.');
}