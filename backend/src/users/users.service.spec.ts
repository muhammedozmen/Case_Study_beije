import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { MailService } from '../mail/mail.service';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let mailService: jest.Mocked<MailService>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    verificationToken: 'mock-token',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockUsersRepository = {
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    findByUsernameAndToken: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    existsByUsername: jest.fn(),
    existsByEmail: jest.fn(),
  };

  const mockMailService = {
    sendVerificationEmail: jest.fn(),
    sendWelcomeEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
    mailService = module.get(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const registerDto: RegisterUserDto = {
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should successfully register a new user', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      mailService.sendVerificationEmail.mockResolvedValue();

      const result = await service.registerUser(registerDto);

      expect(result).toEqual(mockUser);
      expect(usersRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(usersRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(usersRepository.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        verificationToken: expect.any(String),
        isVerified: false,
      });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        'test@example.com',
        'testuser',
        expect.any(String),
      );
    });

    it('should throw ConflictException if username already exists', async () => {
      usersRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(service.registerUser(registerDto)).rejects.toThrow(ConflictException);
      expect(usersRepository.findByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should throw ConflictException if email already exists', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.registerUser(registerDto)).rejects.toThrow(ConflictException);
      expect(usersRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should still create user even if email sending fails', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      mailService.sendVerificationEmail.mockRejectedValue(new Error('Email service error'));

      const result = await service.registerUser(registerDto);

      expect(result).toEqual(mockUser);
      expect(usersRepository.create).toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    const username = 'testuser';
    const verificationToken = 'valid-token';

    it('should successfully verify user email', async () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      const verifiedUser = { ...mockUser, isVerified: true, verificationToken: null };

      usersRepository.findByUsernameAndToken.mockResolvedValue(unverifiedUser);
      usersRepository.save.mockResolvedValue(verifiedUser);
      mailService.sendWelcomeEmail.mockResolvedValue();

      const result = await service.verifyEmail(username, verificationToken);

      expect(result).toEqual(verifiedUser);
      expect(usersRepository.findByUsernameAndToken).toHaveBeenCalledWith(username, verificationToken);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...unverifiedUser,
        isVerified: true,
        verificationToken: null,
      });
      expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(mockUser.email, mockUser.username);
    });

    it('should return user if already verified', async () => {
      const verifiedUser = { ...mockUser, isVerified: true };
      usersRepository.findByUsernameAndToken.mockResolvedValue(verifiedUser);

      const result = await service.verifyEmail(username, verificationToken);

      expect(result).toEqual(verifiedUser);
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid token', async () => {
      usersRepository.findByUsernameAndToken.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(mockUser);

      await expect(service.verifyEmail(username, 'invalid-token')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      usersRepository.findByUsernameAndToken.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);

      await expect(service.verifyEmail(username, verificationToken)).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkVerificationStatus', () => {
    const username = 'testuser';

    it('should return verification status for verified user', async () => {
      const verifiedUser = { ...mockUser, isVerified: true };
      usersRepository.findByUsername.mockResolvedValue(verifiedUser);

      const result = await service.checkVerificationStatus(username);

      expect(result).toEqual({
        user: verifiedUser,
        message: 'User is verified',
      });
    });

    it('should return verification status for unverified user', async () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      usersRepository.findByUsername.mockResolvedValue(unverifiedUser);

      const result = await service.checkVerificationStatus(username);

      expect(result).toEqual({
        user: unverifiedUser,
        message: 'User is not verified',
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);

      await expect(service.checkVerificationStatus(username)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resendVerificationEmail', () => {
    const username = 'testuser';

    it('should successfully resend verification email', async () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      usersRepository.findByUsername.mockResolvedValue(unverifiedUser);
      usersRepository.save.mockResolvedValue(unverifiedUser);
      mailService.sendVerificationEmail.mockResolvedValue();

      await service.resendVerificationEmail(username);

      expect(usersRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...unverifiedUser,
        verificationToken: expect.any(String),
      });
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);

      await expect(service.resendVerificationEmail(username)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is already verified', async () => {
      const verifiedUser = { ...mockUser, isVerified: true };
      usersRepository.findByUsername.mockResolvedValue(verifiedUser);

      await expect(service.resendVerificationEmail(username)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email sending fails', async () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      usersRepository.findByUsername.mockResolvedValue(unverifiedUser);
      usersRepository.save.mockResolvedValue(unverifiedUser);
      mailService.sendVerificationEmail.mockRejectedValue(new Error('Email service error'));

      await expect(service.resendVerificationEmail(username)).rejects.toThrow(BadRequestException);
    });
  });
});
