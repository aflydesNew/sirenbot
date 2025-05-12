import { Telegraf, Markup, Context } from 'telegraf'
import { config } from '@/config/env'
import { servicesList, messages } from '@/config/vars'
import { setupFormHandler } from '@/services/formHandler'

const bot = new Telegraf(config.telegramToken)

const adminChatId = config.adminChatId || ''
const backToMenuButton = ['⬅️ Назад в меню']
// 📌 Главное меню
const mainMenu = Markup.keyboard([
    ['Получить видеоурок + гайд'],
    ['PDF-книга “Кожа и вросшие”'],
    ['Записаться на обучение депиляции'],
    ['О продукте'],
    ['Купить продукцию Никольс']
]).resize()

bot.start((ctx: Context) => {
    ctx.reply(
        messages.helloMessage,
        {
            parse_mode: 'HTML',
            reply_markup: mainMenu.reply_markup
        }
    )
})

bot.hears('Получить видеоурок + гайд', (ctx: Context) => {
    const service = servicesList.find(service => service.id === '1')

    if (!service) {
        return ctx.reply('Произошла ошибка, попробуйте снова позже', Markup.keyboard([...backToMenuButton]))
    }

    ctx.reply(service.description, Markup.keyboard([[`${service.name}`, `buy_${service.id}`], backToMenuButton]))
})

bot.hears('PDF-книга “Кожа и вросшие”', (ctx: Context) => {
    const service = servicesList.find(service => service.id === '2')

    if (!service) {
        return ctx.reply('Произошла ошибка, попробуйте снова позже', Markup.keyboard([...backToMenuButton]))
    }

    ctx.reply(service.description, Markup.keyboard([[`${service.name}`, `buy_${service.id}`], backToMenuButton]))
})

bot.hears('Записаться на обучение депиляции', (ctx: Context) => {
    ctx.reply(messages.signUpForTraining, Markup.keyboard([['Записаться на курс'], backToMenuButton]))
})

bot.action(/buy_/, (ctx: Context) => {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery && 'data' in callbackQuery) {
        const serviceId = callbackQuery.data.replace('buy_', '');
        const service = servicesList.find(s => s.id === serviceId);
        if (service) {
            ctx.reply(`Вы выбрали услугу: ${service.name}\nОписание: ${service.description}`);
        } else {
            ctx.reply('Извините, услуга не найдена.');
        }
    }
})
bot.hears('⬅️ Назад в меню', (ctx: Context) => {
    ctx.reply('Выберите действие:', mainMenu)
})

export const startBot = () => {
    bot.launch()
    setupFormHandler(bot)
    console.log('🤖 Telegram бот запущен!')
}
