import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Zamil Akhter' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'zamil@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  password!: string;
}

export class LogInDto {
  @ApiProperty({ example: 'zamil@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  password!: string;
}
