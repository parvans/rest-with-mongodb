import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class SignUpDto{
    @IsNotEmpty()
    @IsString()
    @Length(3,100)
    readonly name:string;

    @IsNotEmpty()
    @IsString()
    @IsEmail({},{message:"Please enter correct email"})
    readonly email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password:string;
}