import { Telegraf, Markup, Context } from 'telegraf'
import { CallbackQuery } from 'telegraf/typings/core/types/typegram'
import { config } from '@/config/env'
import { servicesList, messages, backToMenuButton, mainMenuMarkup } from '@/config/vars'
import { setupFormHandler } from '@/services/formHandler'

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
    if (callbackQuery && 'data' in callbackQuery) {
        const serviceId = callbackQuery.data.replace('buy_', '')
        const service = servicesList.find(s => s.id === serviceId)

        if (!service) {
            return ctx.reply('Извините, услуга не найдена.', { parse_mode: 'HTML' })
        }

        await ctx.reply(
            `<b>Вы выбрали услугу:</b> ${service.name}\n\n<b>Цена:</b> ${service.price} ₽`,
            {
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.callback('💳 Оплатить через Tinkoff', `pay_tinkoff_${service.id}`)],
                    [Markup.button.callback('⬅️ Назад в меню', 'back_to_menu')]
                ]).reply_markup
            }
        )
    }
})

bot.action(/pay_tinkoff_/, async (ctx: Context) => {
    const callbackQuery = ctx.callbackQuery

    if (!callbackQuery || !('data' in callbackQuery)) {
        return ctx.reply('Некорректный формат запроса.')
    }

    const serviceId = callbackQuery.data.replace('pay_tinkoff_', '')
    const service = servicesList.find(s => s.id === serviceId)

    if (!service) {
        return ctx.reply('Услуга не найдена.', { parse_mode: 'HTML' })
    }

    await ctx.reply(
        `<b>Тестовая оплата</b>\n\nВы бы оплатили: <b>${service.name}</b> за <b>${service.price} ₽</b>\n\n⚠️ Пока что оплата не подключена.`,
        { parse_mode: 'HTML' }
    )
})

bot.hears('⬅️ Назад в меню', (ctx: Context) => {
    ctx.reply('Выберите действие:', mainMenuMarkup)
})

export const startBot = () => {
    bot.launch()
    console.log('🤖 Telegram бот запущен!')
}
