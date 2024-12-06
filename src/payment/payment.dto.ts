import { PaymentStatus, SubscriptionType } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class PaymentDto {
  @IsNumber()
  amount: number

  @IsString()
  @IsEnum(SubscriptionType)
  subscriptionType: SubscriptionType

  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus
}
