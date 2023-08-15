import { defineStore } from 'pinia'

interface ToastData {
    ms: number
    message: string
    classes: string
}

export const useToastStore = defineStore({
    id: 'toast',

    state: () => ({
        ms: 0,
        message: '',
        classes: '',
        isVisible: false,
    }),

    actions: {
        showToast({ ms, message, classes }: ToastData) {
            this.ms = parseInt(ms.toString())
            this.message = message
            this.classes = classes
            this.isVisible = true

            setTimeout(() => {
                this.classes += ' -translate-y-28'
            }, 10)

            setTimeout(() => {
                this.classes = this.classes.replace('-translate-y-28', '')
            }, this.ms - 500)

            setTimeout(() => {
                this.isVisible = false
            }, this.ms)
        },
    },
})
