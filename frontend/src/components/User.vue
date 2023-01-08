<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="scrollable mx-auto full-height">
        <span>
            <h1 class="display-4">{{ this.user.name }} {{ this.user.surname }}</h1>
            <h3>@{{ this.user.username }}</h3>
            <h5 class="font-italic">{{ this.user.bio }}</h5>
        </span>
        <div id="message-div">
            <div class="pt-3" v-if="!isEmpty">
                <div class="bordered-top" v-for='message in messages' :key='message.id'>
                    <button class="blank-button w-100 text-left" @click="openMessage(message.idCreator, message.id)">
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
                <p class="square centerd">No messages yet</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'User',
    data() {
        return {
            isEmpty: '',
            user: {},
            messages: []
        }
    },
    watch: {
        '$route.query': {
            handler(obj) {
                this.isEmpty = '';
                this.user = {};
                this.messages = [];
                this.fetchUserData(obj.id);
                this.fetchUserMessages(obj.id);
            },
            immediate: true,
        }
    },
    methods: {
        async fetchUserData(id) {
            const url = 'http://localhost:3000/api/social/users/' + id;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                let userJson = await res.json();
                this.user = userJson.user;
                let documentTitle = document.title.replace("User", "@" + this.user.username);
                document.title = documentTitle;
            } else if (res.status === 400) {
                console.log()
            } else if (res.status === 404) {
                console.log();
            }
        },
        async fetchUserMessages(id) {
            const url = 'http://localhost:3000/api/social/messages/' + id;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                let messagesJson = await res.json();
                this.messages = messagesJson.messages.reverse();
            } else if (res.status === 400) {
                console.log()
            } else if (res.status === 404) {
                this.isEmpty = true;
            }
        },
        openMessage(userId, messageId) {
            const pathTo = "/message";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo, query: { userId: userId, messageId: messageId } }).catch(() => { });
            }
        }
    }
}
</script>

<style scoped>
.scrollable {
    overflow: auto !important;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
    display: none;
}

.full-height {
    height: 100vh!important;
}
</style>