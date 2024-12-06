import { Injectable, UnauthorizedException } from '@nestjs/common'
import { hash } from 'argon2'
import { RegisterAuthDto } from 'src/auth/auth.dto'
import { FileService } from 'src/file/file.service'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async getProfile(id: string) {
    const profile = await this.getById(id)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = profile

    return {
      user: rest,
    }
  }

  async create(dto: RegisterAuthDto) {
    const user = {
      email: dto.email,
      name: dto.name,
      password: await hash(dto.password),
      avatar: '',
    }
    return this.prisma.user.create({
      data: user,
    })
  }

  async update(id: string, img: Express.Multer.File, dto: UserDto) {
    const { avatar } = await this.getById(id)

    if (avatar) await this.fileService.deleteFile(avatar)

    const imgUrl = await this.fileService.createFile(img)

    let data = { ...dto, avatar: imgUrl }

    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) }
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        name: true,
        email: true,
      },
    })
  }

  async adminChecker(userId: string, block: boolean) {
    const { role } = await this.getById(userId)

    if (role !== 'ADMIN') {
      if (block) {
        throw new UnauthorizedException('Permission denied')
      }
      return false
    }

    return true
  }
}
