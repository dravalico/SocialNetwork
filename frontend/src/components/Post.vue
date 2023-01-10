<template>
    <div class="vh-100">
        <h1 class="display-4">Create a post</h1>
        <b-form @submit.prevent="postMessage">
            <b-form-group label="Create a post of arbitrary length and share it">
                <b-form-textarea rows="8" no-resize v-model="form.text"
                    placeholder="What are you thinking about?"></b-form-textarea>
            </b-form-group>
            <button type="submit" class="btn btn-primary w-100" :disabled="isEmpty">Share it!</button>
        </b-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                text: "",
            }
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
                console.log()
                // TODO
            } else {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        }
    }
}
</script>