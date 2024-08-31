import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsString()
  mobile?: string;

  @IsString()
  gender?: string;

  @Transform(({ value }) => value && new Date(value))
  date_of_birth?: Date;
}
