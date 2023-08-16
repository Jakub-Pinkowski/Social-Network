<template>
    <div class="max-w-7xl mx-auto grid grid-cols-2 gap-4">
        <div class="main-left">
            <div class="p-12 bg-white border border-gray-200 rounded-lg">
                <h1 class="mb-6 text-2xl">Sign up</h1>

                <p class="mb-6 text-gray-500">
                    Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
                    Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
                    Lorem ipsum dolor sit mate. Lorem ipsum dolor sit mate.
                </p>

                <p class="font-bold">
                    Already have an account?
                    <RouterLink :to="{ name: 'login' }" class="underline"
                        >Click here</RouterLink
                    >
                    to log in!
                </p>
            </div>
        </div>

        <div class="main-right">
            <div class="p-12 bg-white border border-gray-200 rounded-lg">
                <form class="space-y-6" @submit.prevent="submitForm">
                    <div>
                        <label>Name</label><br />
                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="Your full name"
                            class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg"
                        />
                    </div>

                    <div>
                        <label>E-mail</label><br />
                        <input
                            v-model="form.email"
                            type="email"
                            placeholder="Your e-mail address"
                            class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg"
                        />
                    </div>

                    <div>
                        <label>Password</label><br />
                        <input
                            v-model="form.password1"
                            type="password"
                            placeholder="Your password"
                            class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg"
                        />
                    </div>

                    <div>
                        <label>Repeat password</label><br />
                        <input
                            v-model="form.password2"
                            type="password"
                            placeholder="Repeat your password"
                            class="w-full mt-2 py-4 px-6 border border-gray-200 rounded-lg"
                        />
                    </div>

                    <template v-if="errors.length > 0">
                        <div class="=bg-red-300 text-white rounded-lg p-6">
                            <p v-for="error in errors" :key="error">
                                {{ error }}
                            </p>
                        </div>
                    </template>

                    <div>
                        <button
                            class="py-4 px-6 bg-blue-500 text-white rounded-lg"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useToastStore } from '@/stores/toast'

interface FormFields {
    email: string
    name: string
    password1: string
    password2: string
}

const toastStore = useToastStore()

const form = ref<FormFields>({
    email: '',
    name: '',
    password1: '',
    password2: '',
})

const errors = ref<string[]>([])

const submitForm = () => {
    errors.value = []

    if (form.value.email === '') {
        errors.value.push('E-mail is required')
    }

    if (form.value.name === '') {
        errors.value.push('Name is required')
    }

    if (form.value.password1 === '') {
        errors.value.push('Password is required')
    }

    if (form.value.password1 !== form.value.password2) {
        errors.value.push('Passwords do not match')
    }

    if (errors.value.length === 0) {
        axios
            .post('/api/signup/', form.value)
            .then((response) => {
                if (response.data.message === 'success') {
                    const toastData = {
                        ms: 5000,
                        message: 'The user is registered. You can log in now.',
                        classes: 'bg-emerald-500',
                    }

                    toastStore.showToast(toastData)

                    form.value = {
                        email: '',
                        name: '',
                        password1: '',
                        password2: '',
                    }
                } else {
                    const errorToastData = {
                        ms: 5000,
                        message: 'Something went wrong. Please try again.',
                        classes: 'bg-red-500',
                    }

                    toastStore.showToast(errorToastData)
                }
            })
            .catch((error) => {
                console.log('error: ', error)
            })
    }
}
</script>

<style scoped></style>
