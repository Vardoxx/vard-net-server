import { Injectable, UnauthorizedException } from '@nestjs/common'
import { FileService } from 'src/file/file.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { NewDto, NewStatusDto } from './new.dto'

@Injectable()
export class NewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  async getAll(id: string) {
    const newsItems = await this.prismaService.new.findMany({
      where: {
        id,
      },
      include: {
        author: true,
      },
    })

    const newsItemsWithUpdatedAuthors = await Promise.all(
      newsItems.map(async (e) => {
        return {
          ...e,
          author: {
            name: e.author.name,
            avatar: e.author.avatar,
          },
        }
      }),
    )

    return newsItemsWithUpdatedAuthors
  }

  async getById(id: string) {
    return this.prismaService.new.findUnique({
      where: {
        id,
      },
    })
  }

  async create(userId: string, img: Express.Multer.File, dto: NewDto) {
    const imgUrl = await this.fileService.createFile(img)

    return this.prismaService.new.create({
      data: {
        ...dto,
        imgUrl,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  async update(
    id: string,
    img: Express.Multer.File,
    userId: string,
    dto: NewDto,
  ) {
    await this.author(userId, id)

    const { imgUrl } = await this.getById(id)
    await this.fileService.deleteFile(imgUrl)

    const imgUrlAfter = await this.fileService.createFile(img)

    return this.prismaService.new.update({
      where: {
        id,
      },
      data: {
        ...dto,
        imgUrl: imgUrlAfter,
      },
    })
  }

  async updateStatus(id: string, userId: string, dto: Partial<NewStatusDto>) {
    await this.userService.adminChecker(userId, true)

    return this.prismaService.new.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  async delete(id: string, userId: string) {
    const { imgUrl } = await this.getById(id)

    await this.fileService.deleteFile(imgUrl)

    return this.prismaService.new.delete({
      where: {
        id,
      },
    })
  }

  private async author(userId: string, id: string) {
    const { authorId } = await this.getById(id)

    const admin = await this.userService.adminChecker(userId, false)

    if (!admin) {
      if (userId !== authorId)
        throw new UnauthorizedException('Permission denied2')
      return true
    }
  }
}
