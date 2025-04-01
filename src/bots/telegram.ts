import { Telegraf, Markup } from 'telegraf';
import { config } from '@/config/env';
import { servicesList } from '@/config/vars';

const bot = new Telegraf(config.telegramToken);

// 📌 Главное меню
const mainMenu = Markup.keyboard([
    ["🛍 Список услуг", "📞 Контакты"],
    ["✍ Оставить контакт"],
]).resize();

bot.start((ctx) => {
    ctx.reply(
        `Привет, ${ctx.from.first_name}! 👋\nДобро пожаловать! Выберите действие:`,
        mainMenu
    );
});

bot.hears("🛍 Список услуг", (ctx) => {
    const buttons = servicesList.map((service) =>
      [Markup.button.callback(`🛒 Купить ${service.name} — ${service.price}₽`, `buy_${service.id}`)]
    );
  
    ctx.reply("Вот список наших услуг:", Markup.inlineKeyboard(buttons));
});

bot.hears("📞 Контакты", (ctx) => {
    ctx.reply("Наши контакты:\n📧 email@example.com\n📞 +7 (123) 456-78-90");
});

bot.hears("✍ Оставить контакт", (ctx) => {
    ctx.reply("Отправьте ваш номер телефона:", Markup.keyboard([
        Markup.button.contactRequest("📲 Отправить номер"),
    ]).resize());
});

export const startBot = () => {
    bot.launch();  // Просто запускаем бота без передачи polling
    console.log("🤖 Telegram бот запущен!");
};
