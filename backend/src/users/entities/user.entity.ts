import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  @Index('IDX_USER_USERNAME')
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('IDX_USER_EMAIL')
  email: string;

  @ApiProperty({
    description: 'Email verification token',
    example: 'abc123def456ghi789jkl012',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationToken: string | null;

  @ApiProperty({
    description: 'Whether the user email is verified',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
