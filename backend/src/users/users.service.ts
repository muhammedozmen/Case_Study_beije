import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { MailService } from '../mail/mail.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}

  /**
   * Generate a secure random verification token
   */
  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Register a new user and send verification email
   */
  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, email } = registerUserDto;

    // Check if username already exists
    const existingUserByUsername = await this.usersRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingUserByEmail = await this.usersRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Generate verification token
    const verificationToken = this.generateVerificationToken();

    // Create user
    const userData = {
      username,
      email,
      verificationToken,
      isVerified: false,
    };

    const user = await this.usersRepository.create(userData);

    // Send verification email
    try {
      await this.mailService.sendVerificationEmail(email, username, verificationToken);
      this.logger.log(`Verification email sent to ${email} for user ${username}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      // Don't throw error here, user is already created
      // In production, you might want to queue this for retry
    }

    return user;
  }

  /**
   * Verify user email with username and token
   */
  async verifyEmail(username: string, verificationToken: string): Promise<User> {
    // Find user by username and token
    const user = await this.usersRepository.findByUsernameAndToken(username, verificationToken);

    if (!user) {
      // Check if user exists but token is wrong
      const userExists = await this.usersRepository.findByUsername(username);
      if (userExists) {
        throw new BadRequestException('Invalid verification token');
      }
      throw new NotFoundException('User not found');
    }

    // Check if already verified
    if (user.isVerified) {
      return user;
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = null; // Clear the token after successful verification

    const updatedUser = await this.usersRepository.save(user);

    // Send welcome email
    try {
      await this.mailService.sendWelcomeEmail(user.email, user.username);
      this.logger.log(`Welcome email sent to ${user.email} for user ${username}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${user.email}:`, error);
      // Don't throw error, verification is successful
    }

    return updatedUser;
  }

  /**
   * Check user verification status
   */
  async checkVerificationStatus(username: string): Promise<{
    user: User;
    message: string;
  }> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const message = user.isVerified ? 'User is verified' : 'User is not verified';

    return {
      user,
      message,
    };
  }

  /**
   * Find user by username (for internal use)
   */
  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findByUsername(username);
  }

  /**
   * Find user by email (for internal use)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  /**
   * Resend verification email (bonus feature)
   */
  async resendVerificationEmail(username: string): Promise<void> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    // Generate new verification token
    const verificationToken = this.generateVerificationToken();
    user.verificationToken = verificationToken;

    await this.usersRepository.save(user);

    // Send verification email
    try {
      await this.mailService.sendVerificationEmail(user.email, user.username, verificationToken);
      this.logger.log(`Verification email resent to ${user.email} for user ${username}`);
    } catch (error) {
      this.logger.error(`Failed to resend verification email to ${user.email}:`, error);
      throw new BadRequestException('Failed to send verification email');
    }
  }
}
