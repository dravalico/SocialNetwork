<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div v-if="dataReady" class="mx-auto h-100">
        <span>
            <h1 class="display-4">{{ this.user.name }} {{ this.user.surname }}</h1>
            <h3>@{{ this.user.username }}</h3>
            <div>

            </div>
            <h5 class="font-italic">{{ this.user.bio }}</h5>
        </span>
        <div id="message-div" class="h-100">
            <div class="pt-4" v-if="!isEmpty">
                <div class="bordered-top" v-for='message in messages' :key='message.id'>
                    <button class="blank-button w-100 text-left" @click="openMessage(message.idCreator, message.id)">
                        <p>On {{ message.date.split("T")[0] }} said</p>
                        <p class="ml-3">{{ message.text }}</p>
                        <button class="like-btn blank-button mb-3" @click.stop="">
                            <span>
                                <b-icon-heart></b-icon-heart>
                                {{ message.likes.length }}
                            </span>
                        </button>
                    </button>
                </div>
            </div>
            <div class="bordered-top row justify-content-center pt-4" v-else>
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
            dataReady: false,
            isEmpty: '',
            user: {},
            messages: []
        }
    },
    watch: {
        '$route.query': {
            handler(obj) {
                this.dataReady = false;
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
                this.dataReady = true;
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
                this.messages = messagesJson.messages;
                this.dataReady = true;
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
.bordered-top {
    border-top: 1px solid #F0F3F4;
}

.like-btn:hover {
    color: red;
}
</style>
