<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <b-form @submit.prevent="onSubmit">
            <b-form-input id="name" size="lg" class="mb-4 w-75" v-model="form.name" placeholder="Name"
                required></b-form-input>
            <b-form-input id="surname" size="lg" class="mb-4 w-75" v-model="form.surname" placeholder="Surname"
                required></b-form-input>
            <b-form-input id="username" size="lg" class="mb-4 w-75" v-model="form.username" placeholder="Username"
                @blur="checkUsername(form.username)" required></b-form-input>
            <b-form-input id="password" size="lg" class="mb-4 w-75" v-model="form.password" placeholder="Password"
                required></b-form-input>
            <b-form-input id="confirmPassword" size="lg" class="mb-4 w-75" v-model="form.confirmPassword"
                placeholder="Confirm password" required></b-form-input>
            <b-form-input id="bio" size="lg" class="mb-4 w-75" v-model="form.bio" placeholder="Biography"></b-form-input>
            <b-button pill block type="submit" class="w-75" variant="outline-primary">Sign up</b-button>
        </b-form>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            form: {
                name: '',
                surname: '',
                username: '',
                password: '',
                confirmPassword: '',
                bio: '',
            }
        }
    },
    methods: {
        async onSubmit() {
            const body = {
                'name': this.form.name,
                'surname': this.form.surname,
                'username': this.form.username,
                'password': this.form.password,
                'confirmPassword': this.form.confirmPassword,
                'bio': this.form.bio
            }
            const res = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Character-Encoding': 'utf-8',
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                this.$router
                    .push({ path: '/' })
                    .then(() => { this.$router.go() });
            } else {
                console.log(JSON.stringify(res));
            }
        },
        checkUsername(input) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 400) {
                        document.getElementById("username").classList.add('is-invalid');
                        document.getElementById("username").classList.remove('is-valid');
                    } else if (xhr.status === 404) {
                        document.getElementById("username").classList.add('is-valid');
                        document.getElementById("username").classList.remove('is-invalid');
                    }
                }
            };
            const URL = "http://localhost:3000/api/social/search?q="
                .concat(input)
            xhr.open("GET", URL, true);
            xhr.send();
        }
    }
}
</script>