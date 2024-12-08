import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
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
import { NewDto, NewStatusDto } from './new.dto'
import { NewService } from './new.service'

@Controller('new')
export class NewController {
  constructor(private readonly newService: NewService) {}

  @Get()
  async getByAll(id: string) {
    return this.newService.getAll(id)
  }

  @Get('by-tag/:tag')
  async getByTag(@Param('tag') tag: string) {
    return this.newService.getByTag(tag)
  }

  @Get('by-title/:title')
  async getByTitle(@Param('title') title: string) {
    return this.newService.getByTitle(title)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.newService.getById(id)
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @CurrentUser('id') userId: string,
    @UploadedFile() img,
    @Body()
    dto: NewDto,
  ) {
    return this.newService.create(userId, img, dto)
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() img,
    @Body() dto: NewDto,
  ) {
    return this.newService.update(id, img, userId, dto)
  }

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Put('status/:id')
  @HttpCode(200)
  @Auth()
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: NewStatusDto,
  ) {
    return this.newService.updateStatus(id, userId, dto)
  }

  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(200)
  @Auth()
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.newService.delete(id, userId)
  }
}
