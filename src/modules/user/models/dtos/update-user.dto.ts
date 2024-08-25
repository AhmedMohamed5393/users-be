import { IsEmail, IsOptional, Length } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email address' })
    email?: string;

    @IsOptional()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password?: string;
}
