import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
    isAuthenticated: boolean
    id: string | null
    name: string | null
    email: string | null
    access: string | null
    refresh: string | null
}

interface TokenData {
    access: string
    refresh: string
}

export const useUserStore = defineStore({
    id: 'user',

    state: (): { user: User } => ({
        user: {
            isAuthenticated: false,
            id: null,
            name: null,
            email: null,
            access: null,
            refresh: null,
        },
    }),

    actions: {
        initStore() {
            if (localStorage.getItem('user.access')) {
                this.user.access = localStorage.getItem('user.access')
                this.user.refresh = localStorage.getItem('user.refresh')
                this.user.id = localStorage.getItem('user.id')
                this.user.name = localStorage.getItem('user.name')
                this.user.email = localStorage.getItem('user.email')
                this.user.isAuthenticated = true

                this.refreshToken()

                console.log('Initialized user: ', this.user)
            }
        },

        setToken(data: TokenData) {
            console.log('Setting token: ', data)

            this.user.access = data.access
            this.user.refresh = data.refresh
            this.user.isAuthenticated = true

            localStorage.setItem('user.access', data.access)
            localStorage.setItem('user.refresh', data.refresh)
        },

        removeToken() {
            console.log('Removing token')

            this.user.access = null
            this.user.refresh = null
            this.user.isAuthenticated = false
            this.user.id = null
            this.user.name = null
            this.user.email = null

            localStorage.removeItem('user.access')
            localStorage.removeItem('user.refresh')
            localStorage.removeItem('user.id')
            localStorage.removeItem('user.name')
            localStorage.removeItem('user.email')
        },

        setUserInfo(user: User) {
            console.log('Setting user info: ', user)

            this.user.id = user.id
            this.user.name = user.name
            this.user.email = user.email

            if (user.id) localStorage.setItem('user.id', user.id)
            if (user.name) localStorage.setItem('user.name', user.name)
            if (user.email) localStorage.setItem('user.email', user.email)

            console.log('User info set: ', this.user)
        },

        refreshToken() {
            axios
                .post('api/account/refresh', {
                    refresh: this.user.refresh,
                })
                .then((response) => {
                    this.user.access = response.data.access

                    localStorage.setItem('user.access', response.data.access)

                    axios.defaults.headers.common[
                        'Authorization'
                    ] = `Bearer ${response.data.access}`
                })
                .catch((error) => {
                    console.log(error)

                    this.removeToken()
                })
        },
    },
})
