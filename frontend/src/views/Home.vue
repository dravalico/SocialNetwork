<template>
    <div class="vh-100">
        <div v-if=this.$store.getters.isAuthenticated>
            <h1 class="display-4">Feed</h1>
            <div id="message-div">
                <div class="pt-3" v-if="!isEmpty">
                    <div class="bordered-top" v-for='message in messages' :key='message.id'>
                        <button class="blank-button w-100 text-left"
                            @click="openMessage(message.idCreator, message.id)">
                            <p>On {{ message.date.split("T")[0] }} said</p>
                            <p class="ml-3" style="font-weight: 600;">{{ message.text }}</p>
                            <button class="like-btn blank-button mb-3" @click.stop="">
                                <span>
                                    <b-icon-heart></b-icon-heart>
                                    {{ message.likes.length }}
                                </span>
                            </button>
                        </button>
                    </div>
                </div>
                <div v-else class="bordered-top row justify-content-center pt-4">
                    <p class="square centerd">In order to create a personalized feed you must first follow at least one
                        user!</p>
                </div>
            </div>
        </div>
        <div v-else class="guest">
            <h1 class="display-4">Welcome, guest</h1>
            <p>
                Welcome to wpSocial!
                As a guest you can search for users by name, surname and username. You will be able to see all their
                messages and the likes they have received.
            </p>
            <p>You won't be able to like posts, you won't be able to create
                messages and you won't be able to have a personalized feed. For all these actions,
                <a href="/#/signup">register</a>, or if you
                are already registered, <a href="/#/signin">log in</a>.
            </p>
        </div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Home",
    data() {
        return {
            isEmpty: true,
            messages: []
        }
    },
    beforeMount() {
        if (this.$store.getters.isAuthenticated) {
            this.getFeed();
        }
    },
    methods: {
        async getFeed() {
            const url = 'http://localhost:3000/api/social/feed';
            const res = await fetch(url, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                let feedJson = await res.json();
                this.messages = feedJson.feed;
                this.isEmpty = false;
            } else {
                this.isEmpty = true;
            }
        },
        openMessage(userId, messageId) {
            const pathTo = "/message";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo, query: { userId: userId, messageId: messageId } });
            }
        },
    }
}
</script>

<style scoped>
p a {
    display: contents !important;
    text-decoration: none !important;
    color: #007bff !important;
}
</style>