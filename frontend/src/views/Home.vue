<template>
    <div>
        <div v-if=this.$store.getters.isAuthenticated>
            <h1 class="display-4">Feed</h1>
            <div id="message-div" v-if="dataLoaded">
                <div class="mt-3" v-if="!isEmpty">
                    <div class="bordered-top" v-for="(message, index) in messages" :key="message.id">
                        <MessagePreview :message="message" :user="users[index]"
                            @forwarded-liked-event="reloadMsgData(message.id, users[index].id)"
                            @forwarded-unliked-event="reloadMsgData(message.id, users[index].id)" />
                    </div>
                    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
                </div>
                <div v-else class="bordered-top mt-3">
                    <p class="square centerd">
                        To create a custom feed, you must first follow at least one user. In addition, this user must
                        have shared at least one message.
                    </p>
                </div>
            </div>
        </div>
        <div v-else class="guest">
            <h1 class="display-4">Welcome, guest</h1>
            <div class="bordered-top mt-3">
                <p>
                    Welcome to wpSocial!
                    As a guest you can search for users by name, surname and username. You will be able to see all their
                    messages and the likes they have received.
                </p>
                <p>
                    You won't be able to like posts, you won't be able to create
                    messages and you won"t be able to have a personalized feed. For all these actions,
                    <a href="/#/signup">register</a>, or if you
                    are already registered, <a href="/#/signin">log in</a>.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import MessagePreview from "../components/MessagePreview.vue";
import InfiniteLoading from 'vue-infinite-loading';

export default {
    data() {
        return {
            isEmpty: true,
            messages: [],
            page: 0,
            users: [],
            dataLoaded: false,
            stopInfiniteLoading: false,
        }
    },
    components: {
        MessagePreview,
        InfiniteLoading
    },
    async beforeMount() {
        if (this.$store.getters.isAuthenticated) {
            await this.getFeed();
            this.dataLoaded = true;
        }
    },

    methods: {
        async getFeed() {
            const res = await fetchApi("/social/feed?page=" + this.page, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                let feedJson = await res.json();
                this.messages.push(...feedJson.feed);
                for (let index in feedJson.feed) {
                    await this.fetchUsername(feedJson.feed[index].idCreator);
                }
                this.page = this.page + 1;
                this.isEmpty = false;
            } else if (res.status === 500) {
                this.$router.push({ path: "/error" }).catch(() => { });
            } else if (res.status === 404) {
                this.stopInfiniteLoading = true;
            } else {
                if (this.messages.length === 0) {
                    this.isEmpty = true;
                }
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
        },
        async reloadMsgData(msgId, userId) {
            const res = await fetchApi("/social/messages/" + userId + "/" + msgId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                let messageJson = await res.json();
                for (let index in this.messages) {
                    if (this.messages[index].id === msgId) {
                        this.$set(this.messages, index, messageJson.message)
                        break;
                    }
                }
            } else {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        async infiniteHandler($state) {
            if (!this.stopInfiniteLoading) {
                await this.getFeed();
                $state.loaded();
            } else {
                $state.complete()
            }
        }
    },
}
</script>

<style scoped>
p a {
    display: contents !important;
    color: #007bff !important;
}
</style>