# Docker PostgreSQL Commands Reference

This file contains commands used to manage the project's PostgreSQL database with Docker.

## Basic Setup

### 1. Pull PostgreSQL Image
```bash
docker pull postgres:16
```

### 2. Create Docker Volume
```bash
docker volume create emailverif_pgdata
```

### 3. Start PostgreSQL Container
```bash
docker run --name emailverif-postgres \
  -e POSTGRES_USER=nest \
  -e POSTGRES_PASSWORD=nestpass \
  -e POSTGRES_DB=nestdb \
  -p 5432:5432 \
  -v emailverif_pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

## Container Management

### Check Container Status
```bash
# List all containers
docker ps

# List all containers (including stopped)
docker ps -a

# Check specific container
docker ps | grep emailverif-postgres
```

### Container Lifecycle
```bash
# Start container
docker start emailverif-postgres

# Stop container
docker stop emailverif-postgres

# Restart container
docker restart emailverif-postgres

# Remove container (data will be preserved in volume)
docker rm emailverif-postgres

# Remove container and volume (WARNING: This deletes all data)
docker rm emailverif-postgres
docker volume rm emailverif_pgdata
```

### View Container Logs
```bash
# View logs
docker logs emailverif-postgres

# Follow logs in real-time
docker logs -f emailverif-postgres

# View last 50 lines
docker logs --tail 50 emailverif-postgres
```

## Database Operations

### Connect to Database
```bash
# Connect with psql
docker exec -it emailverif-postgres psql -U nest -d nestdb

# Connect and run single command
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "SELECT NOW();"
```

### Database Queries
```bash
# List all databases
docker exec -it emailverif-postgres psql -U nest -c "\l"

# List all tables in nestdb
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "\dt"

# Describe users table
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "\d users"

# Count users
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "SELECT COUNT(*) FROM users;"

# View all users
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "SELECT * FROM users;"
```

### Database Backup and Restore
```bash
# Create backup
docker exec emailverif-postgres pg_dump -U nest nestdb > backup.sql

# Restore from backup
docker exec -i emailverif-postgres psql -U nest -d nestdb < backup.sql

# Create backup with custom format
docker exec emailverif-postgres pg_dump -U nest -Fc nestdb > backup.dump

# Restore from custom format
docker exec -i emailverif-postgres pg_restore -U nest -d nestdb backup.dump
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using port 5432
netstat -tulpn | grep 5432

# Use different port
docker run --name emailverif-postgres \
  -e POSTGRES_USER=nest \
  -e POSTGRES_PASSWORD=nestpass \
  -e POSTGRES_DB=nestdb \
  -p 5439:5432 \
  -v emailverif_pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

#### 2. Authentication Issues
```bash
# Add authentication method
docker run --name emailverif-postgres \
  -e POSTGRES_USER=nest \
  -e POSTGRES_PASSWORD=nestpass \
  -e POSTGRES_DB=nestdb \
  -e POSTGRES_HOST_AUTH_METHOD=md5 \
  -p 5439:5432 \
  -v emailverif_pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

#### 3. Container Won't Start
```bash
# Check logs for errors
docker logs emailverif-postgres

# Remove and recreate container
docker rm emailverif-postgres
# Run the docker run command again
```

#### 4. Data Persistence Issues
```bash
# Check if volume exists
docker volume ls | grep emailverif_pgdata

# Inspect volume
docker volume inspect emailverif_pgdata

# Create volume if missing
docker volume create emailverif_pgdata
```

### Diagnostic Commands
```bash
# Check container resource usage
docker stats emailverif-postgres

# Inspect container configuration
docker inspect emailverif-postgres

# Check container processes
docker exec emailverif-postgres ps aux

# Check PostgreSQL version
docker exec emailverif-postgres psql -U nest -c "SELECT version();"

# Check database size
docker exec emailverif-postgres psql -U nest -d nestdb -c "SELECT pg_size_pretty(pg_database_size('nestdb'));"
```

## Advanced Operations

### Performance Monitoring
```bash
# Check active connections
docker exec emailverif-postgres psql -U nest -d nestdb -c "SELECT * FROM pg_stat_activity;"

# Check database statistics
docker exec emailverif-postgres psql -U nest -d nestdb -c "SELECT * FROM pg_stat_database WHERE datname='nestdb';"

# Check table sizes
docker exec emailverif-postgres psql -U nest -d nestdb -c "SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;"
```

### Configuration Management
```bash
# View PostgreSQL configuration
docker exec emailverif-postgres psql -U nest -c "SHOW ALL;"

# View specific configuration
docker exec emailverif-postgres psql -U nest -c "SHOW max_connections;"

# Check data directory
docker exec emailverif-postgres psql -U nest -c "SHOW data_directory;"
```

### Security Operations
```bash
# List all users
docker exec emailverif-postgres psql -U nest -c "\du"

# Create new user
docker exec emailverif-postgres psql -U nest -c "CREATE USER newuser WITH PASSWORD 'password';"

# Grant privileges
docker exec emailverif-postgres psql -U nest -c "GRANT ALL PRIVILEGES ON DATABASE nestdb TO newuser;"

# Change password
docker exec emailverif-postgres psql -U nest -c "ALTER USER nest PASSWORD 'newpassword';"
```

## Production Considerations

### Environment Variables
```bash
# Production container with environment file
docker run --name emailverif-postgres \
  --env-file .env.production \
  -p 5432:5432 \
  -v emailverif_pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

### Resource Limits
```bash
# Container with resource limits
docker run --name emailverif-postgres \
  -e POSTGRES_USER=nest \
  -e POSTGRES_PASSWORD=nestpass \
  -e POSTGRES_DB=nestdb \
  -p 5432:5432 \
  -v emailverif_pgdata:/var/lib/postgresql/data \
  --memory=1g \
  --cpus=0.5 \
  -d postgres:16
```

### Health Checks
```bash
# Container with health check
docker run --name emailverif-postgres \
  -e POSTGRES_USER=nest \
  -e POSTGRES_PASSWORD=nestpass \
  -e POSTGRES_DB=nestdb \
  -p 5432:5432 \
  -v emailverif_pgdata:/var/lib/postgresql/data \
  --health-cmd="pg_isready -U nest -d nestdb" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  -d postgres:16

# Check health status
docker inspect --format='{{.State.Health.Status}}' emailverif-postgres
```

## Quick Reference

### Essential Commands
```bash
# Start everything
docker pull postgres:16
docker volume create emailverif_pgdata
docker run --name emailverif-postgres -e POSTGRES_USER=nest -e POSTGRES_PASSWORD=nestpass -e POSTGRES_DB=nestdb -e POSTGRES_HOST_AUTH_METHOD=md5 -p 5439:5432 -v emailverif_pgdata:/var/lib/postgresql/data -d postgres:16

# Connect to database
docker exec -it emailverif-postgres psql -U nest -d nestdb

# Check status
docker ps | grep emailverif-postgres
docker logs emailverif-postgres

# Stop and clean up
docker stop emailverif-postgres
docker rm emailverif-postgres
docker volume rm emailverif_pgdata
```

### Connection Information
- **Host**: localhost
- **Port**: 5439 (mapped from container's 5432)
- **Database**: nestdb
- **Username**: nest
- **Password**: nestpass
- **Connection URL**: `postgresql://nest:nestpass@localhost:5439/nestdb`

---

**Note**: Always backup your data before performing destructive operations. Use appropriate resource limits and security measures in production environments.