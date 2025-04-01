import express from 'express';
import { config } from '@/config/env';
import { checkPayment } from 'services/paymentsStatus';

const app = express();
app.use(express.json());

app.post("/webhook", async (req:any, res:any) => {
    const { OrderId, Status } = req.body;

    if (Status === "CONFIRMED") {
        console.log(`Заказ ${OrderId} оплачен`);
    }

    res.sendStatus(200);
});

app.listen(config.port, () => {
    console.log(`Сервер запущен на порту ${config.port}`);
});
