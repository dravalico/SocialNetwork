<template>
    <div id="scrollable" class="mx-auto vh-100">
        <div>
            <h1 class="display-4">{{ this.user.name }} {{ this.user.surname }}</h1>
            <div>
                <h4>@{{ this.user.username }}</h4>
                <div v-if="this.$store.getters.isAuthenticated">
                    <div v-if="this.$store.getters.userState.user.id != this.user.id">
                        <div v-if="this.$store.getters.userState.user.following.includes(this.user.id)">
                            <button class="btn btn-primary mb-1" @click="unfollowUser">Unfollow</button>
                        </div>
                        <div v-else>
                            <button class="btn btn-primary mb-1" @click="followUser">Follow</button>
                        </div>
                    </div>
                </div>
            </div>
            <h6 class="mt-2 font-italic">{{ this.user.bio }}</h6>
        </div>
        <div id="message-div">
            <div class="pt-2" v-if="messages.length !== 0">
                <div class="bordered-top" v-for="message in messages" :key="message.id">
                    <MessagePreview :message="message" :user="user" @forwarded-liked-event="fetchUserMessages(user.id)"
                        @forwarded-unliked-event="fetchUserMessages(user.id)" @forwarded-auth-event="showModal"
                        @scroll-event="scrollTop" />
                </div>
            </div>
            <div v-else class="bordered-top row justify-content-center pt-4">
                <p class="square centerd">No messages yet</p>
            </div>
        </div>
        <AuthModal />
    </div>
</template>

<script>
import MessagePreview from "../components/MessagePreview.vue";
import AuthModal from "../components/AuthModal.vue";

export default {
    data() {
        return {
            user: {},
            messages: [],
        }
    },
    components: {
        AuthModal,
        MessagePreview
    },
    watch: {
        "$route.query": {
            handler(obj) {
                this.user = {};
                this.messages = [];
                this.fetchUser(obj.id);
                this.fetchUserMessages(obj.id);
            },
            immediate: true,
        },
    },
    methods: {
        async fetchUser(id) {
            const res = await fetchApi("/social/users/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                let userJson = await res.json();
                this.user = userJson.user;
                let documentTitle = document.title.replace("User", "@" + this.user.username);
                document.title = documentTitle;
            } else if (res.status !== 404) {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        async fetchUserMessages(id) {
            const res = await fetchApi("/social/messages/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                let messagesJson = await res.json();
                this.messages = messagesJson.messages.reverse();
            } else if (res.status !== 404) {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        async followUser() {
            const res = await fetchApi("/social/followers/" + this.user.id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                await this.$store.dispatch("verifyAuthentication");
            } else if (res.status !== 404) {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        async unfollowUser() {
            const res = await fetchApi("/social/followers/" + this.user.id, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                await this.$store.dispatch("verifyAuthentication");
            } else if (res.status === 404) {
                this.isEmpty = true;
            } else if (res.status !== 404) {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        async reloadData() {
            await this.fetchUserMessages(this.user.id);
        },
        showModal() {
            this.$bvModal.show("no-auth")
        },
        scrollTop() {
            document.getElementById("scrollable").scrollIntoView();
        }
    }
}
</script>