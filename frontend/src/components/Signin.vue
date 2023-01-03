<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <b-form @submit.prevent="onSubmit">
            <b-form-input id="username" size="lg" class="mb-4 w-75" v-model="form.username" placeholder="Username"
                required></b-form-input>
            <b-form-input id="password" size="lg" class="mb-4 w-75" v-model="form.password" placeholder="Password"
                required></b-form-input>
            <b-button pill block type="submit" class="w-75" variant="outline-primary">Sign in</b-button>
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
    methods: {
        async onSubmit() {
            const body = {
                'username': this.form.username,
                'password': this.form.password
            }
            const res = await fetch('http://localhost:3000/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                this.$router
                    .push({ path: '/' })
                    .then(() => { this.$router.go() });
            } else {
                console.log(await res.json());
            }
        },
    }
}
</script>