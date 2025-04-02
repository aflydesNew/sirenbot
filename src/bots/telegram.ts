import { Telegraf, Markup, Context } from 'telegraf'
import { config } from '@/config/env'
import { servicesList } from '@/config/vars'

const bot = new Telegraf(config.telegramToken)

const adminChatId = 'ВАШ_CHAT_ID' // Замените на ваш реальный chat_id

// 📌 Главное меню
const mainMenu = Markup.keyboard([
    ['🛍 Список услуг', '📞 Контакты'],
    ['✍ Оставить контакт'],
]).resize()

bot.start((ctx: Context) => {
    ctx.reply(
        `Привет, ${ctx.from?.first_name}! 👋\nДобро пожаловать! Выберите действие:`,
        mainMenu
    )
})

bot.hears('🛍 Список услуг', (ctx: Context) => {
    const buttons = servicesList.map((service) =>
        [Markup.button.callback(`🛒 Купить ${service.name} — ${service.price}₽`, `buy_${service.id}`)]
    )

    ctx.reply('Вот список наших услуг:', Markup.inlineKeyboard(buttons))
})

bot.hears('📞 Контакты', (ctx: Context) => {
    ctx.reply(
        'Наши контакты:\n📧 email@example.com\n📞 +7 (123) 456-78-90',
        Markup.keyboard([
            ['⬅️ Назад в меню'],
        ]).resize()
    )
})

bot.hears('✍ Оставить контакт', (ctx: Context) => {
    ctx.reply(
        'Отправьте ваш номер телефона:',
        Markup.keyboard([
            Markup.button.contactRequest('📲 Отправить номер'),
            Markup.button.text('⬅️ Назад в меню'),
        ]).resize()
    )
})

bot.on('contact', (ctx: Context) => {
    if (ctx.message && 'contact' in ctx.message) {
        const contact = ctx.message.contact;
        const user = ctx.from;

        if (contact && user) {
            const contactInfo = `📞 Новый контакт от пользователя ${user.first_name} ${user.last_name || ''} (@${user.username || 'не указан'})\nИмя: ${contact.first_name} ${contact.last_name || ''}\nНомер: ${contact.phone_number}`
        
        ctx.telegram.sendMessage(adminChatId, contactInfo)
            .then(() => {
                ctx.reply('Спасибо! Ваш контакт получен.')
            })
            .catch((error) => {
                console.error('Ошибка отправки сообщения в чат:', error)
                ctx.reply('Произошла ошибка при отправке вашего контакта.')
            })
        }
    } else {
        ctx.reply('Пожалуйста, используйте кнопку для отправки контакта.');
    }
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
    console.log('🤖 Telegram бот запущен!')
}
