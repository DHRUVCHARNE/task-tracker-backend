import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string> {
    console.log('Validating user:', email);  // Debug log

    const user = await this.usersService.findByEmail(email);
    console.log('User found:', user);  // Debug log
    if (!user) {
      console.error('User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);  // Debug log
    if (!isPasswordValid) {
      console.error('Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('User validated successfully',);  // Debug log
    var payload:any={ sub: user._id.toString(), email: user.email };
    try{const token = this.jwtService.sign(payload);
    console.log('Generated Token:', token);  // Debug log for token generation

    return token;}
    catch(error){
      console.error('Error during token generation:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
