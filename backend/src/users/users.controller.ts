import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  RegisterResponseDto,
  VerificationResponseDto,
  CheckVerificationResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';

@ApiTags('users')
@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and sends verification email',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists',
  })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterResponseDto> {
    this.logger.log(`Registration attempt for username: ${registerUserDto.username}`);

    const user = await this.usersService.registerUser(registerUserDto);

    this.logger.log(`User registered successfully: ${user.username}`);

    return {
      message: 'User registered successfully. Please check your email for verification.',
      user: new UserResponseDto(user),
    };
  }

  @Get('verify-email/:username/:verificationToken')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify user email',
    description: 'Verifies user email using username and verification token',
  })
  @ApiParam({
    name: 'username',
    description: 'Username of the user to verify',
    example: 'johndoe',
  })
  @ApiParam({
    name: 'verificationToken',
    description: 'Verification token sent via email',
    example: 'abc123def456ghi789jkl012',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid verification token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async verifyEmail(
    @Param('username') username: string,
    @Param('verificationToken') verificationToken: string,
  ): Promise<VerificationResponseDto> {
    this.logger.log(`Email verification attempt for username: ${username}`);

    const user = await this.usersService.verifyEmail(username, verificationToken);

    this.logger.log(`Email verified successfully for user: ${username}`);

    return {
      message: 'Email verified successfully',
      user: new UserResponseDto(user),
    };
  }

  @Get('check-verification/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check user verification status',
    description: 'Returns whether the user email is verified or not',
  })
  @ApiParam({
    name: 'username',
    description: 'Username to check verification status',
    example: 'johndoe',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification status retrieved successfully',
    type: CheckVerificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async checkVerification(
    @Param('username') username: string,
  ): Promise<CheckVerificationResponseDto> {
    this.logger.log(`Verification status check for username: ${username}`);

    const { user, message } = await this.usersService.checkVerificationStatus(username);

    return {
      message,
      username: user.username,
      isVerified: user.isVerified,
    };
  }

  @Post('resend-verification/:username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend verification email',
    description: 'Resends verification email to user (bonus feature)',
  })
  @ApiParam({
    name: 'username',
    description: 'Username to resend verification email',
    example: 'johndoe',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User is already verified or email send failed',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async resendVerification(@Param('username') username: string): Promise<{
    message: string;
  }> {
    this.logger.log(`Resend verification email for username: ${username}`);

    await this.usersService.resendVerificationEmail(username);

    this.logger.log(`Verification email resent successfully for user: ${username}`);

    return {
      message: 'Verification email sent successfully. Please check your email.',
    };
  }
}
