import IService from "@/interfaces/IService";

export const contacts = {
    phone: {
        value: '+79999999999',
        text: '+7(999)999-99-99'
    },
    mail: {
        value: 'example@mail.ru',
        text: 'example@mail.ru'
    }
}

export const servicesList:IService[] = [
    {
        id: '1',
        name: 'Example 1',
        description: 'description 1',
        price: 10,
        image: ''
    }
]

