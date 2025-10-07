import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { MailService } from '../src/mail/mail.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let mailService: MailService;

  // Mock mail service to prevent actual email sending during tests
  const mockMailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    })
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
    mailService = moduleFixture.get<MailService>(MailService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/user/register (POST)', () => {
    const validUserData = {
      username: 'testuser123',
      email: 'test123@example.com',
    };

    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send(validUserData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('username', validUserData.username);
          expect(res.body.user).toHaveProperty('email', validUserData.email);
          expect(res.body.user).toHaveProperty('isVerified', false);
          expect(res.body.user).toHaveProperty('createdAt');
          expect(res.body.message).toBe('User registered successfully. Please check your email for verification.');
        });
    });

    it('should return 400 for invalid username (too short)', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'ab',
          email: 'test@example.com',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Username must be between 3 and 50 characters');
        });
    });

    it('should return 400 for invalid username (special characters)', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'test-user!',
          email: 'test@example.com',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Username can only contain letters, numbers, and underscores');
        });
    });

    it('should return 400 for invalid email format', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'testuser',
          email: 'invalid-email',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Please provide a valid email address');
        });
    });

    it('should return 409 for duplicate username', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'duplicateuser',
          email: 'first@example.com',
        })
        .expect(201);

      // Second registration with same username
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'duplicateuser',
          email: 'second@example.com',
        })
        .expect(409)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Username already exists');
        });
    });

    it('should return 409 for duplicate email', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'firstuser',
          email: 'duplicate@example.com',
        })
        .expect(201);

      // Second registration with same email
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'seconduser',
          email: 'duplicate@example.com',
        })
        .expect(409)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Email already exists');
        });
    });
  });

  describe('Email Verification Flow (e2e)', () => {
    let testUser: any;
    let verificationToken: string;

    beforeEach(async () => {
      // Register a test user
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'verifyuser',
          email: 'verify@example.com',
        })
        .expect(201);

      testUser = response.body.user;

      // Extract verification token from mock call
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalled();
      const mockCall = mockMailService.sendVerificationEmail.mock.calls[0];
      verificationToken = mockCall[2]; // Third parameter is the token
    });

    describe('/user/verify-email/:username/:token (GET)', () => {
      it('should verify email successfully', () => {
        return request(app.getHttpServer())
          .get(`/user/verify-email/${testUser.username}/${verificationToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'Email verified successfully');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('isVerified', true);
            expect(res.body.user).toHaveProperty('username', testUser.username);
          });
      });

      it('should return 404 for non-existent user', () => {
        return request(app.getHttpServer())
          .get(`/user/verify-email/nonexistentuser/${verificationToken}`)
          .expect(404)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'User not found');
          });
      });

      it('should return 400 for invalid token', () => {
        return request(app.getHttpServer())
          .get(`/user/verify-email/${testUser.username}/invalid-token`)
          .expect(400)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'Invalid verification token');
          });
      });
    });

    describe('/user/check-verification/:username (GET)', () => {
      it('should return unverified status for new user', () => {
        return request(app.getHttpServer())
          .get(`/user/check-verification/${testUser.username}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'User is not verified');
            expect(res.body).toHaveProperty('username', testUser.username);
            expect(res.body).toHaveProperty('isVerified', false);
          });
      });

      it('should return verified status after verification', async () => {
        // First verify the email
        await request(app.getHttpServer())
          .get(`/user/verify-email/${testUser.username}/${verificationToken}`)
          .expect(200);

        // Then check verification status
        return request(app.getHttpServer())
          .get(`/user/check-verification/${testUser.username}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'User is verified');
            expect(res.body).toHaveProperty('username', testUser.username);
            expect(res.body).toHaveProperty('isVerified', true);
          });
      });

      it('should return 404 for non-existent user', () => {
        return request(app.getHttpServer())
          .get('/user/check-verification/nonexistentuser')
          .expect(404)
          .expect((res) => {
            expect(res.body).toHaveProperty('message', 'User not found');
          });
      });
    });
  });

  describe('Complete User Flow (e2e)', () => {
    it('should complete the full registration -> verification -> check flow', async () => {
      const userData = {
        username: 'fullflowuser',
        email: 'fullflow@example.com',
      };

      // Step 1: Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/user/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.user.isVerified).toBe(false);
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalled();

      // Extract verification token from mock call
      const mockCall = mockMailService.sendVerificationEmail.mock.calls[0];
      const verificationToken = mockCall[2];

      // Step 2: Check initial verification status
      await request(app.getHttpServer())
        .get(`/user/check-verification/${userData.username}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isVerified).toBe(false);
          expect(res.body.message).toBe('User is not verified');
        });

      // Step 3: Verify email
      await request(app.getHttpServer())
        .get(`/user/verify-email/${userData.username}/${verificationToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user.isVerified).toBe(true);
          expect(res.body.message).toBe('Email verified successfully');
        });

      // Step 4: Check final verification status
      await request(app.getHttpServer())
        .get(`/user/check-verification/${userData.username}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.isVerified).toBe(true);
          expect(res.body.message).toBe('User is verified');
        });

      // Verify welcome email was sent
      expect(mockMailService.sendWelcomeEmail).toHaveBeenCalledWith(
        userData.email,
        userData.username,
      );
    });
  });

  describe('/user/resend-verification/:username (POST)', () => {
    let testUser: any;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send({
          username: 'resenduser',
          email: 'resend@example.com',
        })
        .expect(201);

      testUser = response.body.user;
      jest.clearAllMocks(); // Clear the registration email mock call
    });

    it('should resend verification email successfully', () => {
      return request(app.getHttpServer())
        .post(`/user/resend-verification/${testUser.username}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'Verification email sent successfully. Please check your email.');
          expect(mockMailService.sendVerificationEmail).toHaveBeenCalled();
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/user/resend-verification/nonexistentuser')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'User not found');
        });
    });
  });
});
