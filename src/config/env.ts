import dotenv from "dotenv";

dotenv.config();

export const config = {
    telegramToken: process.env.TELEGRAM_TOKEN || '',
    vkToken: process.env.VK_TOKEN || '',
    adminChatId: process.env.ADMIN_CAHT_ID,
    tinkoff: {
        terminalKey: process.env.TINKOFF_TERMINAL_KEY || 'https://securepay.tinkoff.ru/v2/',
        password: process.env.TINKOFF_PASSWORD || '',
        apiUrl: process.env.TINKOFF_API_URL || '',
    },
    webhookUrl: process.env.WEBHOOK_URL || '',
    port: Number(process.env.PORT) || 3000,
};
