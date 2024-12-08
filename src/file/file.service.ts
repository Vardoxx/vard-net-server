import { BadRequestException, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'

@Injectable()
export class FileService {
  async createFile(file: Express.Multer.File) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      console.log(file)
      throw new BadRequestException('JPG or PNG only')
    }

    const fileName = uuid.v4() + '.jpg' || '.png'
    const filePath = path.resolve('src', 'static')

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true })
    }
    fs.writeFileSync(path.join(filePath, fileName), file.buffer)
    return fileName
  }

  async deleteFile(fileName: string): Promise<boolean> {
    const filePath = path.join(this.getFilePath(), fileName)

    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Ошибка при удалении файла: ${err}`)
          reject(err)
        } else {
          console.log(`Файл ${fileName} успешно удален`)
          resolve(true)
        }
      })
    })
  }

  private getFilePath(): string {
    return path.join(process.cwd(), 'src', 'static')
  }
}
