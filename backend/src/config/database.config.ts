import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import * as path from 'path';

// Explicitly specify the .env file path
config({ path: path.resolve(process.cwd(), '.env') });

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST') || 'localhost',
  port: configService.get('POSTGRES_PORT') || 5432,
  username: configService.get('POSTGRES_USER') || 'nest',
  password: configService.get('POSTGRES_PASSWORD') || 'nestpass',
  database: configService.get('POSTGRES_DB') || 'nestdb',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
});
