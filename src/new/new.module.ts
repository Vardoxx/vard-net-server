import { Module } from '@nestjs/common'
import { FileService } from 'src/file/file.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { NewController } from './new.controller'
import { NewService } from './new.service'

@Module({
  controllers: [NewController],
  providers: [NewService, FileService, PrismaService, UserService],
})
export class NewModule {}
