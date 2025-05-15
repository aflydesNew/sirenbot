import express, { Request, Response } from "express";
import { config } from "@/config/env";
import { initPayment } from "@/services/payment";
import { startBot } from "@/bots/telegram";
const app = express();
app.use(express.json());

app.post("/webhook", async (req: Request, res: Response) => {
    try {
        const { OrderId, Status } = req.body;

        if (Status === "CONFIRMED") {
            console.log(`✅ Заказ ${OrderId} оплачен`);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Ошибка обработки вебхука:", error);
        res.status(500).send("Ошибка сервера");
    }
});

app.listen(config.port, () => {
    console.log(`🚀 Сервер запущен на порту ${config.port}`);
});

startBot()