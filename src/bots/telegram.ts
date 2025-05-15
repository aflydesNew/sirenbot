import { Telegraf, Markup, Context } from 'telegraf'
import { CallbackQuery } from 'telegraf/typings/core/types/typegram'
import { config } from '@/config/env'
import { servicesList, messages, backToMenuButton, mainMenuMarkup } from '@/config/vars'
import { setupFormHandler } from '@/services/formHandler'
import { initPayment } from '@/services/payment'

const bot = new Telegraf(config.telegramToken)

const adminChatId = config.adminChatId || ''

bot.start((ctx: Context) => {
    ctx.reply(
        messages.helloMessage,
        {
            parse_mode: 'HTML',
            reply_markup: mainMenuMarkup.reply_markup
        }
    )
})

bot.hears('Получить видеоурок + гайд', (ctx: Context) => {
    const service = servicesList.find(service => service.id === '1')

    if (!service) {
        return ctx.reply('Произошла ошибка, попробуйте снова позже', {
            parse_mode: 'HTML',
            reply_markup: Markup.keyboard([...backToMenuButton]).resize().reply_markup
        })
    }

    ctx.reply(service.description, {
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback(`${service.buttonName} (${service.price} ₽)`, `buy_${service.id}`)],
            [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
        ]).reply_markup
    })
})

bot.hears('PDF-книга “Кожа и вросшие”', (ctx: Context) => {
    const service = servicesList.find(service => service.id === '2')
     if (!service) {
        return ctx.reply('Произошла ошибка, попробуйте снова позже', {
            parse_mode: 'HTML',
            reply_markup: Markup.keyboard([...backToMenuButton]).resize().reply_markup
        })
    }

    ctx.reply(service.description, {
        parse_mode: 'HTML',
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback(`${service.buttonName} (${service.price} ₽)`, `buy_${service.id}`)],
            [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
        ]).reply_markup
    })
})

bot.hears('Записаться на обучение депиляции', (ctx: Context) => {
    ctx.reply(messages.signUpForTraining, Markup.keyboard([['Записаться на курс'], backToMenuButton]))
})

bot.hears('О продукте', (ctx: Context) => {
    ctx.reply(messages.aboutProduct, Markup.keyboard([...backToMenuButton]))
})

bot.action(/buy_/, async (ctx: Context) => {
  const callbackQuery = ctx.callbackQuery

  if (!callbackQuery || !('data' in callbackQuery)) {
    return ctx.reply('Некорректный формат запроса.')
  }

  const serviceId = callbackQuery.data.replace('buy_', '')
  const service = servicesList.find(s => s.id === serviceId)

  if (!service) {
    return ctx.reply('Услуга не найдена.', { parse_mode: 'HTML' })
  }

  const orderId = `${service.id}_${ctx.from?.id || 'unknown'}`

  try {
    const payment = await initPayment(
      service.price,
      orderId,
      service.name,
      service.paymentDescription || '',
      'test@test.ru',
      '+79999999999'
    )

    if (payment?.PaymentURL) {
      await ctx.reply(
        `<b>Оплата ${service.name}</b>\n\nНажмите кнопку ниже, чтобы перейти к оплате.`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '💳 Перейти к оплате',
                  url: payment.PaymentURL,
                },
              ],
            ],
          },
        }
      )
    } else {
      console.error('Ошибка при инициализации оплаты:', payment)
      await ctx.reply('Произошла ошибка при создании платежа. Попробуйте позже.')
    }
  } catch (error) {
    console.error('Ошибка оплаты:', error)
    await ctx.reply('Произошла внутренняя ошибка при попытке оплаты.')
  }
})

bot.hears('⬅️ Назад в меню', (ctx: Context) => {
    ctx.reply('Выберите действие:', mainMenuMarkup)
})

export const startBot = () => {
    bot.launch()
    console.log('🤖 Telegram бот запущен!')
}
