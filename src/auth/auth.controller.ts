import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor( private authService:AuthService){}

    @Post('/signup')
    async signUp(
        @Body()
        signUpDto:SignUpDto):Promise<{token:string}>{
        return this.authService.signUp(signUpDto)
    }
    @Post('/login')
    async userLogin(
        @Body()
        logindto:LoginDto):Promise<{token:string}>{
        return this.authService.logIn(logindto)
    }
}
