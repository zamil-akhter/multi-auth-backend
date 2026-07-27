import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'Zamil Akhter' })
  name!: string;

  @ApiProperty({ example: 'zamil@example.com' })
  email!: string;

  @ApiProperty({ example: 'Password@123' })
  password!: string;
}
