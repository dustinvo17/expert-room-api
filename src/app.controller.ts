import { Controller, Request, Post, UseGuards , Get} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {UsersService} from './users/users.service'
import { AuthService } from './auth/auth.service';
@Controller()
export class AppController {
  constructor(private usersService: UsersService, private authService: AuthService) {
  
  }
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);

  }
  
  @Post('auth/signup')
  async signup(@Request() req) {
   
    return this.authService.registerUser(req.body.username,req.body.password,req.body.name)
  }

  @Get('auth/logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.usersService.findUserById(req.user.userId)
  
  }
  // @Get()
  // testUser(){
  //   return this.usersService.addUser('dustinvo','dustin123')
  // }
}