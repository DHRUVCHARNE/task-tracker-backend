import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    console.log('Signup request received');
    try{return this.usersService.createUser(body.email, body.password);} 
    catch(error){
      return error;
    }   
  }
}
