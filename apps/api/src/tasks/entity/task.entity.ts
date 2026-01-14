import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../app/auth/entity/user.entity';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'Personal' })
  category: 'Work' | 'Personal';

  @Column({ default: 'todo' })
  status: 'todo' | 'in-progress' | 'done';

  @Column()
  ownerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @Column()
  orgId: string;
}
