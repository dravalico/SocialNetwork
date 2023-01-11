<template>
    <div class="vh-100">
        <div v-if=this.$store.getters.isAuthenticated>
            <h1 class="display-4">Feed</h1>
            <div id="message-div" v-if="dataLoaded">
                <div class="pt-2" v-if="!isEmpty">
                    <div class="bordered-top" v-for="(message, index) in messages" :key="message.id">
                        <MessagePreview :message="message" :user="users[index]" @liked-event="getFeed"
                            @unliked-event="getFeed" />
                    </div>
                </div>
                <div v-else class="bordered-top pt-2">
                    <p class="square centerd">
                        To create a custom feed, you must first follow at least one user. In addition, this user must
                        have shared at least one message.
                    </p>
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
            <p>
                You won"t be able to like posts, you won"t be able to create
                messages and you won"t be able to have a personalized feed. For all these actions,
                <a href="/#/signup">register</a>, or if you
                are already registered, <a href="/#/signin">log in</a>.
            </p>
        </div>
    </div>
</template>

<script>
import MessagePreview from "../components/MessagePreview.vue";

export default {
    components: {
        MessagePreview
    },
    data() {
        return {
            isEmpty: true,
            messages: [],
            users: [],
            dataLoaded: false
        }
    },
    async created() {
        if (this.$store.getters.isAuthenticated) {
            await this.getFeed();
            for (let index in this.messages) {
                await this.fetchUsername(this.messages[index].idCreator);
            }
            this.dataLoaded = true;
        }
    },
    methods: {
        async getFeed() {
            const res = await fetchApi("/social/feed", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                let feedJson = await res.json();
                this.messages = feedJson.feed;
                this.isEmpty = false;
            } else if (res.status === 500) {
                this.$router.push({ path: "/error" }).catch(() => { });
            } else {
                this.isEmpty = true;
            }
        },
        async fetchUsername(userId) {
            let user = await fetchApi("/social/users/" + userId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (user.ok) {
                const userJson = await user.json();
                this.users.push(userJson.user);
            } else {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        }
    }
}
</script>

<style scoped>
p a {
    display: contents !important;
    color: #007bff !important;
}
</style>