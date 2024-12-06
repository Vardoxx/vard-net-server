import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import * as YooKassa from 'yookassa'
import { PaymentStatusDto } from './payment-status.dto'
import { PaymentDto } from './payment.dto'

const yooKassa = new YooKassa({
  shopId: process.env['SHOP_ID'],
  secretKey: process.env['PAYMENT_TOKEN'],
})

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: string) {
    return this.prismaService.payment.findMany({
      where: { id: userId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async placePayment(userId: string, dto: PaymentDto) {
    const order = await this.prismaService.payment.create({
      data: {
        status: dto.status,
        subscriptionType: dto.subscriptionType,
        amount: dto.amount,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })

    const payment = await yooKassa.createPayment({
      amount: {
        value: dto.amount.toFixed(2),
        currency: 'RUB',
        userId: userId,
      },
      payment_method_data: {
        /* CHANGE */
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        /* CHANGE */
        return_url: 'http://localhost:3000/thanks',
      },
      /* CHANGE */
      description: `Order #${order.id}`,
    })

    return payment
  }

  async updateStatus(dto: PaymentStatusDto) {
    if (dto.event === 'payment.waiting_for_capture') {
      const payment = await yooKassa.capturePayment(dto.object.id)
      return payment
    }

    if (dto.event === 'payment.succeeded') {
      const orderId = dto.object.description.split('#')[1]
      const subscriptionType = dto.object.subscription
      const userId = dto.object.userId

      await this.prismaService.payment.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'PAID',
        },
      })

      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          subscription: subscriptionType,
        },
      })

      return true
    }
  }
}
