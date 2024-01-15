import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  readonly u_id: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
