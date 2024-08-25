import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RoleEnum } from '../../../../shared/enums/role.enum';
import { LoginEvent } from './login-event.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 20, default: RoleEnum.client })
  role: string;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @OneToMany(() => LoginEvent, (login_event) => login_event.user)
  login_event: LoginEvent[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
