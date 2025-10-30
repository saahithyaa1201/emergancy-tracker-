import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  BadRequestException 
} from '@nestjs/common';
import { AuthService } from './auth.service';

// DTOs (Data Transfer Objects)
export class SignUpDto {
  email: string;
  password: string;
  fullName: string;
}

export class SignInDto {
  email: string;
  password: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    // Validate input
    if (!signUpDto.email || !signUpDto.password || !signUpDto.fullName) {
      throw new BadRequestException('Email, password, and full name are required');
    }

    if (signUpDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    // Validate input
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.signIn(signInDto);
  }
}