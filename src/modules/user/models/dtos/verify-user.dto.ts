import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyUserDto {
    @IsNotEmpty({ message: "Email is required" })
    @IsString({ message: "Invalid email" })
    email: string;

    @IsNotEmpty({ message: "Token is required" })
    @IsString({ message: "Invalid token" })
    @Length(6, 6, { message: "token should contains 6 digits" })
    email_token: string;
}
