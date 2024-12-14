import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from 'src/authentification/dto/signup.dto';

export class UpdateUserDto extends PartialType(SignUpDto) {}
