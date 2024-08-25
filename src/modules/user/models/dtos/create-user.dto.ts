import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { RoleEnum } from '../../../../shared/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;

  @IsOptional()
  role?: string = RoleEnum.client;
}
