import { CheckStatus } from '@prisma/client'
import { IsArray, IsString } from 'class-validator'

export class NewDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsArray()
  tag: string[]
}

export class NewStatusDto {
  @IsString()
  checkStatus: CheckStatus
}
