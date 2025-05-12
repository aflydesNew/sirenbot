import { Context, Telegraf } from 'telegraf'
import axios from 'axios'
import { Markup } from 'telegraf'
import FormState from '@/interfaces/IFormState'

const userFormState = new Map<number, FormState>()

export const setupFormHandler = (bot: Telegraf) => {
    // Запуск формы по кнопке
    bot.hears('Записаться на курс', (ctx: Context) => {
        userFormState.set(ctx.from.id, {
            step: 'fio',
            data: {}
        })
        ctx.reply('Введите ваше ФИО:')
    })

    // Обработка ввода пользователя
    bot.on('text', async (ctx: Context) => {
        const state = userFormState.get(ctx.from.id)

        if (!state) return // не в процессе формы

        const input = ctx.message.text

        if (state.step === 'fio') {
            state.data.fio = input
            state.step = 'contact'
            ctx.reply('Введите ваш контакт (телефон или Telegram):')
            return
        }

        if (state.step === 'contact') {
            state.data.contact = input
            state.step = 'message'
            ctx.reply('Введите ваше сообщение:')
            return
        }

        if (state.step === 'message') {
            state.data.message = input

            try {
                await axios.post('https://your-api.com/submit-form', {
                    fio: state.data.fio,
                    contact: state.data.contact,
                    message: state.data.message
                })

                ctx.reply('Спасибо! Ваша заявка отправлена.')
            } catch (error) {
                ctx.reply('Произошла ошибка при отправке формы. Попробуйте позже.')
            }

            userFormState.delete(ctx.from.id)

            ctx.reply('⬅️ Возврат в меню', Markup.keyboard([
                ['Получить видеоурок + гайд'],
                ['PDF-книга “Кожа и вросшие”'],
                ['Записаться на обучение депиляции'],
                ['О продукте'],
                ['Купить продукцию Никольс']
            ]).resize())
        }
    })
}