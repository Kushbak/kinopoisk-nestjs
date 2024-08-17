import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'firstName is required' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'lastName is required' })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'email required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;

  // Если у вас есть другие поля, их можно добавить здесь
}
