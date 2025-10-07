import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Debug: Check environment variables
        const host = configService.get('POSTGRES_HOST') || 'localhost';
        const port = configService.get('POSTGRES_PORT') || 5432;
        const username = configService.get('POSTGRES_USER') || 'nest';
        const password = configService.get('POSTGRES_PASSWORD') || 'nestpass';
        const database = configService.get('POSTGRES_DB') || 'nestdb';
        
        console.log('🔍 Database Config Debug:');
        console.log('POSTGRES_HOST:', host);
        console.log('POSTGRES_PORT:', port);
        console.log('POSTGRES_USER:', username);
        console.log('POSTGRES_PASSWORD:', password);
        console.log('POSTGRES_DB:', database);
        console.log('🔗 Connection String:', `postgres://${username}:${password}@${host}:${port}/${database}`);
        
        return {
          type: 'postgres',
          host: host,
          port: parseInt(port.toString()),
          username: username,
          password: password,
          database: database,
          entities: [User],
          synchronize: false,
          logging: true, // Enable detailed logging
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
