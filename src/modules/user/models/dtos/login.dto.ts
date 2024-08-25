import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsNotEmpty({ message: 'Password should not be empty' })
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;
}
