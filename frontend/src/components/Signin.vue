<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="w-75 mx-auto">
        <h1 class="display-4">Sign in</h1>
        <b-form @submit.prevent="onSubmit">
            <b-form-group label="Enter your username">
                <b-form-input id="username" class="mb-1" v-model="form.username" placeholder="Username"></b-form-input>
            </b-form-group>

            <b-form-group label="Enter your password">
                <b-form-input id="password" class="mb-1" v-model="form.password" placeholder="Password"></b-form-input>
            </b-form-group>

            <button type="submit" class="btn btn-primary w-100 rounded" :disabled="!isComplete">Sign in</button>
        </b-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
            }
        }
    },
    computed: {
        isComplete() {
            if (this.form.username === '' || this.form.password === '') {
                return false;
            }
            return true;
        }
    },
    methods: {
        async onSubmit() {
            const body = {
                'username': this.form.username,
                'password': this.form.password
            }
            for (let element in body) {
                document.getElementById(element).classList.remove('is-invalid');
            }
            const res = await fetch('http://localhost:3000/api/auth/signin', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                this.$router.replace({ path: '/' });
            } else if (res.status === 400) {
                const errorsJson = await res.json();
                const errors = errorsJson.error;
                for (let i in errors) {
                    document.getElementById(errors[i].param).classList.add('is-invalid');
                }
            } else if (res.status === 404) {
                /*const errorsJson = await res.json();
                const errors = errorsJson.error;*/
            }
        },
    }
}
</script>

<style scoped>
.rounded {
    border-radius: 50rem !important;
}
</style>