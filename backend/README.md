# beije Case Study - Email Verification System

## Project Overview and Architecture

### Purpose
This project is a backend API system that implements email verification flow during user registration. Users can activate their accounts by clicking on the verification link sent to their email after registration.

### Stack
- **Framework**: Nest.js (TypeScript)
- **Database**: PostgreSQL (with Docker)
- **ORM**: TypeORM
- **Email Service**: SendGrid (Free API)
- **Validation**: class-validator
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Linting**: ESLint + Prettier

### Modules
- **AppModule**: Main application module
- **DatabaseModule**: TypeORM database configuration
- **UsersModule**: User operations (registration, verification, check)
- **MailModule**: SendGrid email sending
- **ConfigModule**: Environment variables management

### Folder Structure
```
backend/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.config.ts  # Database configuration
│   │   └── mail.config.ts      # Email configuration
│   ├── database/               # Database operations
│   │   ├── migrations/         # TypeORM migration files
│   │   └── database.module.ts  # Database module
│   ├── users/                  # User module
│   │   ├── dto/               # Data Transfer Objects
│   │   │   └── register-user.dto.ts
│   │   ├── entities/          # Database entities
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts # API endpoints
│   │   ├── users.service.ts   # Business logic
│   │   ├── users.repository.ts # Database operations
│   │   └── users.module.ts    # User module
│   ├── mail/                  # Email module
│   │   ├── mail.service.ts    # SendGrid integration
│   │   └── mail.module.ts     # Email module
│   ├── common/                # Shared files
│   │   ├── filters/           # Exception filters
│   │   └── pipes/             # Validation pipes
│   ├── app.module.ts          # Main application module
│   ├── app.controller.ts      # Root controller
│   ├── app.service.ts         # Root service
│   └── main.ts                # Application entry point
├── test/                      # Test files
├── .env                       # Environment variables
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── nest-cli.json              # Nest CLI configuration
└── README.md                  # This file
```

## Requirements

### System Requirements
- **Node.js**: 20+
- **npm**: Latest version
- **Docker Desktop**: For PostgreSQL container

### External Services
- **SendGrid Account**: Free tier is sufficient
  - API Key required
  - Single Sender Verification needed
  - Dynamic Templates setup required

## Environment Variables (.env)

Create a `.env` file in the backend directory with the following variables:

```env
# Application Configuration
PORT=3000
NODE_ENV=development
APP_BASE_URL=http://localhost:3000

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5439
POSTGRES_USER=nest
POSTGRES_PASSWORD=nestpass
POSTGRES_DB=nestdb
DATABASE_URL=postgres://nest:nestpass@localhost:5439/nestdb

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_VERIFICATION_TEMPLATE_ID=d-your-verification-template-id
SENDGRID_WELCOME_TEMPLATE_ID=d-your-welcome-template-id
MAIL_FROM_NAME=Email Verification
MAIL_FROM_EMAIL=no-reply@beije.com

# Security
JWT_SECRET=your-super-secret-jwt-key-here
```

## PostgreSQL Setup with Docker CLI

### Step 1: Pull PostgreSQL Image
```bash
docker pull postgres:16
```

### Step 2: Create Volume for Data Persistence
```bash
docker volume create emailverif_pgdata
```

### Step 3: Run PostgreSQL Container
```bash
docker run --name emailverif-postgres \
  -e POSTGRES_USER=nest \
  -e POSTGRES_PASSWORD=nestpass \
  -e POSTGRES_DB=nestdb \
  -e POSTGRES_HOST_AUTH_METHOD=md5 \
  -p 5439:5432 \
  -v emailverif_pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

### Step 4: Verify Container is Running
```bash
docker logs -f emailverif-postgres
```

Wait until you see: `database system is ready to accept connections`

### Step 5: Test Database Connection
```bash
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "SELECT NOW();"
```

### Step 6: Create Required Extensions
```bash
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

## Database Schema and Manual Table Creation

Since TypeORM CLI has authentication issues, create the table manually:

### Connect to Database
```bash
docker exec -it emailverif-postgres psql -U nest -d nestdb
```

### Create Users Table
```sql
-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE "users" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "username" character varying NOT NULL,
    "email" character varying NOT NULL,
    "verificationToken" character varying NOT NULL,
    "isVerified" boolean NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
    CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
);

-- Create indexes for better performance
CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username");
CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email");
CREATE INDEX "IDX_users_verification_token" ON "users" ("verificationToken");

-- Exit psql
\q
```

### Verify Table Creation
```bash
docker exec -it emailverif-postgres psql -U nest -d nestdb -c "\dt"
```

## SendGrid Setup

### 1. Create SendGrid Account
- Go to [SendGrid](https://sendgrid.com/)
- Sign up for free account
- Verify your account

### 2. Single Sender Verification
- Go to Settings > Sender Authentication
- Click "Verify a Single Sender"
- Add your email (e.g., no-reply@beije.com)
- Complete verification process

### 3. Create API Key
- Go to Settings > API Keys
- Click "Create API Key"
- Choose "Restricted Access"
- Grant "Mail Send" permissions
- Copy the API key to your `.env` file

### 4. Create Dynamic Templates
- Go to Email API > Dynamic Templates
- Create two templates:
  1. **Verification Email Template**
  2. **Welcome Email Template**
- Copy template IDs to your `.env` file

For detailed template setup, see `SENDGRID_TEMPLATES.md`

## Running the Project

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Start Development Server
```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000`

### 4. Access API Documentation
Swagger documentation: `http://localhost:3000/api`

## API Endpoints

### 1. User Registration
**POST** `/user/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Process:**
1. Validate input data
2. Check if username/email already exists
3. Generate random verification token
4. Save user to database with `isVerified: false`
5. Send verification email via SendGrid
6. Return success response

### 2. Email Verification
**GET** `/user/verify-email/:username/:verificationToken`

**Response (200) - Success:**
```json
{
  "message": "Email verified successfully. Welcome!",
  "user": {
    "id": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "isVerified": true,
    "verifiedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (404) - User Not Found:**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

**Response (400) - Invalid Token:**
```json
{
  "statusCode": 400,
  "message": "Invalid verification token",
  "error": "Bad Request"
}
```

**Process:**
1. Find user by username
2. Check if verification token matches
3. Update `isVerified` to `true`
4. Clear verification token
5. Send welcome email
6. Return success response

### 3. Check Verification Status
**GET** `/user/check-verification/:username`

**Response (200) - Verified:**
```json
{
  "message": "User is verified",
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "isVerified": true,
    "verifiedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (200) - Not Verified:**
```json
{
  "message": "User is not verified",
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (404) - User Not Found:**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## Testing

### Unit Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### Test Scenarios
1. **User Registration**
   - Valid registration data
   - Duplicate username/email
   - Invalid email format
   - Missing required fields

2. **Email Verification**
   - Valid verification token
   - Invalid verification token
   - Non-existent user
   - Already verified user

3. **Verification Status Check**
   - Existing verified user
   - Existing unverified user
   - Non-existent user

## Logging and Error Handling

### Global Exception Filter
- Catches all unhandled exceptions
- Returns consistent error responses
- Logs errors for debugging

### Validation
- Uses `class-validator` for DTO validation
- Global ValidationPipe enabled
- Automatic error responses for invalid data

### Logging Levels
- **Error**: System errors and exceptions
- **Warn**: Validation failures and business logic warnings
- **Info**: Successful operations and important events
- **Debug**: Detailed execution flow (development only)

## Common Issues and Solutions

### 1. PostgreSQL Connection Issues
**Problem**: `password authentication failed for user "nest"`

**Solutions:**
- Verify `.env` file has correct credentials
- Check if PostgreSQL container is running: `docker ps`
- Restart container: `docker restart emailverif-postgres`
- Recreate container with `POSTGRES_HOST_AUTH_METHOD=md5`

### 2. SendGrid Authentication Error
**Problem**: `The from address does not match a verified Sender Identity`

**Solutions:**
- Complete Single Sender Verification in SendGrid
- Update `MAIL_FROM_EMAIL` in `.env` to verified email
- Check API key permissions

### 3. Table Does Not Exist Error
**Problem**: `relation "users" does not exist`

**Solutions:**
- Create table manually using SQL commands above
- Verify database connection
- Check if extensions are installed

### 4. Port Already in Use
**Problem**: `Port 5432 is already in use`

**Solutions:**
- Use different port: `-p 5439:5432`
- Stop conflicting containers: `docker stop <container-name>`
- Update `POSTGRES_PORT` in `.env`

### 5. Environment Variables Not Loading
**Problem**: Configuration values are undefined

**Solutions:**
- Verify `.env` file exists in backend directory
- Check file encoding (should be UTF-8)
- Clear Node.js cache: `npm cache clean --force`
- Restart development server

## Database Connection with DBeaver

### Connection Settings
- **Host**: localhost
- **Port**: 5439
- **Database**: nestdb
- **Username**: nest
- **Password**: nestpass

### Connection URL
```
postgresql://nest:nestpass@localhost:5439/nestdb
```

## Quick Start Summary

1. **Setup PostgreSQL:**
   ```bash
   docker run --name emailverif-postgres -e POSTGRES_USER=nest -e POSTGRES_PASSWORD=nestpass -e POSTGRES_DB=nestdb -e POSTGRES_HOST_AUTH_METHOD=md5 -p 5439:5432 -v emailverif_pgdata:/var/lib/postgresql/data -d postgres:16
   ```

2. **Create Database Table:**
   ```bash
   docker exec -it emailverif-postgres psql -U nest -d nestdb
   # Run SQL commands from "Database Schema" section
   ```

3. **Setup Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your SendGrid credentials
   ```

4. **Install and Run:**
   ```bash
   npm install
   npm run start:dev
   ```

5. **Test API:**
   - Visit: `http://localhost:3000/api` for Swagger docs
   - Test registration: `POST /user/register`

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use secure `JWT_SECRET`
- Configure production database URL
- Set proper `APP_BASE_URL`

### Build and Start
```bash
npm run build
npm run start:prod
```

### Docker Deployment
```bash
# Build image
docker build -t beije-email-verification .

# Run container
docker run -p 3000:3000 --env-file .env beije-email-verification
```

## Support and Troubleshooting

### Debug Steps
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Validate SendGrid configuration
5. Check API endpoint responses

### Useful Commands
```bash
# Check container status
docker ps

# View container logs
docker logs emailverif-postgres

# Connect to database
docker exec -it emailverif-postgres psql -U nest -d nestdb

# Clear Node.js cache
npm cache clean --force

# Restart development server
npm run start:dev
```

---