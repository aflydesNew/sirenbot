
type Step = 'fio' | 'contact' | 'message'

export default interface FormState {
    step: Step
    data: {
        fio?: string
        contact?: string
        message?: string
    }
}