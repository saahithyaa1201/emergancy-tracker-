import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: { email: string; password: string; fullName: string }) {
    const { email, password, fullName } = signUpDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
      },
    });

    console.log('✅ User created in database:', email);

    // Return user without password
    return {
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async signIn(signInDto: { email: string; password: string }) {
    const { email, password } = signInDto;

    // Find user in database
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email,
      fullName: user.fullName 
    };
    const access_token = await this.jwtService.signAsync(payload);

    console.log('✅ User signed in from database:', email);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}