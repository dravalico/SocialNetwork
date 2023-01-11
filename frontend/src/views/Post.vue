<template>
    <div class="vh-100">
        <h1 class="display-4">Create a post</h1>
        <b-form @submit.prevent="postMessage">
            <b-form-group label="Create a post of arbitrary length and share it">
                <b-form-textarea rows="8" no-resize v-model="form.text"
                    placeholder="What are you thinking about?"></b-form-textarea>
            </b-form-group>
            <button type="submit" class="btn btn-primary w-100" :disabled="isEmpty">Share it!</button>
            <div class="mt-2">
                <div v-for="(error, index) in errors" :key="index" v-show="somethingWrong">
                    <small id="passwordError" class="block text-danger">
                        {{ error }}
                    </small>
                </div>
            </div>
        </b-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                text: "",
            },
            errors: [],
            somethingWrong: false
        }
    },
    computed: {
        isEmpty() {
            if (this.form.text === "") {
                return true;
            }
            return false;
        }
    },
    methods: {
        async postMessage() {
            const url = "http://localhost:3000/api/social/messages";
            const res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "text": this.form.text })
            });
            if (res.ok) {
                this.$router.push({ path: "/" }).catch(() => { });
            } else if (res.status === 400) {
                const errorsJson = await res.json();
                const errors = errorsJson.error;
                const errorsLog = [];
                for (let i in errors) {
                    errorsLog.push(errors[i].msg);
                }
                this.errors = errorsLog;
                this.somethingWrong = true;
            } else {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        }
    }
}
</script>