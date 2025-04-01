import axios from 'axios';
import { config } from '@/config/env';

export async function checkPayment(orderId: string) {
    const requestData = {
        TerminalKey: config.tinkoff.terminalKey,
        OrderId: orderId,
    };

    try {
        const response = await axios.post(`${config.tinkoff.apiUrl}GetState`, requestData);
        return response.data.Status === "CONFIRMED";
    } catch (error) {
        console.error("Ошибка проверки платежа:", error);
        return false;
    }
}
