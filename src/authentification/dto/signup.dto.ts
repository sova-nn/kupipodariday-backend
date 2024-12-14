import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  @IsString()
  about?: string;
}
