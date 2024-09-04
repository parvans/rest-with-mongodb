import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel:Model<User>,
        private jwtService:JwtService
    ){}

    async signUp(signupDto:SignUpDto):Promise<{token:string}>{
        const {name,email,password}=signupDto

        //find if the user with the sameemail anready exist

        const isUserExist=await this.userModel.findOne({email:email})
        

        if(isUserExist){
            throw new NotAcceptableException("User with the email id already exist")
        }else{
            const hashPassword=await bcrypt.hash(password,10)
            const user=this.userModel.create({
                name,
                email,
                password:hashPassword
            })

            const token=this.jwtService.sign({id:(await user)._id})
            return {token}; 
        }

        
    }

    async logIn(loginDto:LoginDto):Promise<{token:string}>{
        const {email,password}=loginDto
        const user=await this.userModel.findOne({email});
        if (!user) {
            throw new UnauthorizedException("Invalid email or password")
        }
        
        //conpare password

        const isPasswordMatch=await bcrypt.compare(password,(await user).password);

        if (!isPasswordMatch) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const token=this.jwtService.sign({id:(await user)._id})
        return {token};
    }
}