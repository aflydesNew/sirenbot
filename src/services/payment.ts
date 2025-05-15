import axios from 'axios';
import crypto from 'crypto'
import { config } from "@/config/env";

export const generateToken = (params: Record<string, any>, password: string): string => {
  const sorted = Object.keys(params)
    .filter(key => key !== 'Token' && typeof params[key] !== 'object')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('')

  return crypto.createHash('sha256').update(sorted + password).digest('hex')
}

export async function initPayment(
  amount: number,
  orderId: string,
  title: string,
  description: string,
  email: string,
  phone: string
) {
  const payload = {
    amount: amount * 100,
    orderId,
    description,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      name: title,
      email,
      phone,
    },
    payType: 'OFFERED',
  }

  try {
    const response = await axios.post(config.tinkoff.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.tinkoff.terminalKey}}`,
      },
    })

    return {
      PaymentURL: response.data.paymentUrl,
      paymentId: response.data.paymentId,
    }
  } 
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error('Tinkoff API Error:', error.response?.data || error.message)
    } else if (error instanceof Error) {
        console.error('Tinkoff API Error:', error.message)
    } else {
        console.error('Tinkoff API Error: unknown error', error)
    }
    return null
    }
}
