import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { NewModule } from './new/new.module'
import { UserModule } from './user/user.module'
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'src', 'static'),
      serveStaticOptions: { fallthrough: false },
    }),
    AuthModule,
    UserModule,
    NewModule,
    FileModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
