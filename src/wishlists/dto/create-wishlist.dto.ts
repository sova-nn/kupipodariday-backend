import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  image: string;

  @IsInt({ each: true })
  itemsId: number[];

  @IsOptional()
  @MaxLength(1500)
  @IsString()
  description?: string;
}
