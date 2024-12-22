import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('Login request received');
    try {
      const token = await this.authService.validateUser(body.email, body.password);
      console.log('Login request successful');
      console.log('Generated Token:', token);  // This should print the JWT token
      

      return { access_token:token };  // This should return { "token": "<jwt_token>" }
    } catch (error) {
      console.error('Error during login:', error);
      return { message: error.message };  // Return a message on error
    }
  }
  @Post('logout')
  logout() {
    // There is no action required here because JWT tokens are client-side managed
    // Simply instruct the client to remove the JWT token from their storage
    return { message: 'You have been logged out. Please remove your JWT token from localStorage or sessionStorage.' };
  }

  
}
