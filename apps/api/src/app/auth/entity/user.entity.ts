// apps/api/src/app/auth/entity/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '@ngtestwrk/data';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  role: Role;

  @Column()
  orgId: string;
}
