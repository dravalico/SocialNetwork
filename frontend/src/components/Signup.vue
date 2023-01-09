<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="w-75 mx-auto">
        <h1 class="display-4">Create your account</h1>
        <b-form @submit.prevent="onSubmit">
            <b-form-group label="Enter your name">
                <b-form-input id="name" v-model="form.name" placeholder="Name"></b-form-input>
            </b-form-group>

            <b-form-group label="Enter your surname">
                <b-form-input id="surname" v-model="form.surname" placeholder="Surname"></b-form-input>
            </b-form-group>

            <b-form-group label="Choose your username">
                <b-form-input id="username" v-model="form.username" placeholder="Username"
                    @input="checkUsername(form.username)"></b-form-input>
            </b-form-group>

            <b-form-group label="Create a password">
                <b-form-input id="password" type="password" v-model="form.password"
                    placeholder="Password"></b-form-input>
            </b-form-group>

            <b-form-group label="Confirm the password">
                <b-form-input id="confirmPassword" type="password" v-model="form.confirmPassword"
                    placeholder="Confirm password"></b-form-input>
            </b-form-group>

            <b-form-group label="You can choose to share some info about you">
                <b-form-textarea no-resize id="bio" v-model="form.bio"
                    placeholder="Enter something..."></b-form-textarea>
            </b-form-group>

            <button type="submit" class="btn btn-primary w-100" :disabled="!isComplete">Sign up</button>
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
    computed: {
        isComplete() {
            if (this.form.name === '' || this.form.surname === '' || this.form.password === '' || this.form.confirmPassword === '') {
                return false;
            }
            return true;
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
            for (let element in body) {
                document.getElementById(element).classList.remove('is-invalid');
            }
            const res = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                this.$router.replace({ path: '/' })
            } else if (res.status === 400) {
                const errorsJson = await res.json();
                const errors = errorsJson.error;
                for (let i in errors) {
                    document.getElementById(errors[i].param).classList.add('is-invalid');
                }
            }
        },
        checkUsername(input) {
            let xhr = new XMLHttpRequest();
            let isValid = true;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const xhrJson = JSON.parse(xhr.responseText);
                        const users = xhrJson.users;
                        for (let i in users) {
                            if (input.toLowerCase() === users[i].username.toLowerCase()) {
                                isValid = false;
                                break;
                            }
                        }
                        document.getElementById("username").classList.add('is-invalid');
                        document.getElementById("username").classList.remove('is-valid');
                    } else if (xhr.status === 404) {
                        isValid = true;
                    } else if (xhr.status === 400) {
                        isValid = false;
                    }
                    if (isValid) {
                        document.getElementById("username").classList.add('is-valid');
                        document.getElementById("username").classList.remove('is-invalid');
                    } else {
                        document.getElementById("username").classList.add('is-invalid');
                        document.getElementById("username").classList.remove('is-valid');
                    }
                }
            };
            const URL = "http://localhost:3000/api/social/search?q=".concat(input)
            xhr.open("GET", URL, true);
            xhr.send();
        }
    }
}
</script>