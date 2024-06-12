import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from '@/profile/entities/profile.entity';
import { UserRole } from '@/enum/userRole.enum';
import { Room } from '@/room/entities/room.entity';
import { Score } from '@/score/entities/score.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, update: false })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ default: UserRole.User, length: 10, enum: UserRole })
  role: UserRole;

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  profile: Profile;

  @ManyToMany(() => Room, (room) => room.users, { onDelete: 'CASCADE' })
  rooms: Room[];

  @OneToMany(() => Score, (score) => score.user)
  scores: Score[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.passwordHash !== undefined) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
