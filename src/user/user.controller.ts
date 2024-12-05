import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('user/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @Auth()
  async profile(@CurrentUser('id') id: string) {
    return this.userService.getProfile(id)
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @CurrentUser('id') id: string,
    @UploadedFile() img,
    @Body() dto: UserDto,
  ) {
    return this.userService.update(id, img, dto)
  }
}
