import { Telegraf, Markup } from "telegraf";
import { config } from "@/config/env";

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
    ctx.reply("Вот список наших услуг:", Markup.inlineKeyboard([
        [Markup.button.callback("Купить услугу 1", "buy_service_1")],
        [Markup.button.callback("Купить услугу 2", "buy_service_2")],
    ]));
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
    bot.launch();
    console.log("🤖 Telegram бот запущен!");
};
