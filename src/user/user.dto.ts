import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string

  @IsOptional()
  avatar: string

  @ApiProperty()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @IsOptional()
  @IsString()
  password: string
}

// export class BuySubscriptionDto {
//   subscriptionType: SubscriptionType
// }
