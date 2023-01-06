<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div v-if="dataReady">
        <span>
            <h1 class="display-4">Message</h1>
        </span>
        <span>
            <h4>{{ this.user.name }} {{ this.user.surname }}</h4>
            <h5>@{{ this.user.username }}</h5>
        </span>
        <div class="bordered-top mt-3">
            <p class="mt-3" style="font-weight: 800;">
                {{ message.text }}
            </p>
            <div class="bordered-top">
                <p>
                    On {{ message.date.split("T")[0] }} at {{ message.date.split("T")[1].split(":")[0] }}:{{
                        message.date.split("T")[1].split(":")[1]
                    }}
                </p>
                <button class="like-btn blank-button mb-3" @click.stop="">
                    <span>
                        <b-icon-heart></b-icon-heart>
                        {{ message.likes.length }}
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Message',
    data() {
        return {
            dataReady: false,
            user: {},
            message: {}
        }
    },
    watch: {
        '$route.query': {
            handler(obj) {
                this.dataReady = false;
                this.user = {};
                this.fetchUser(obj.userId);
                this.fetchMessage(obj.userId, obj.messageId);
            },
            immediate: true,
        }
    },
    methods: {
        async fetchUser(userId) {
            const url = 'http://localhost:3000/api/social/users/' + userId;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                let userJson = await res.json();
                this.user = userJson.user
                this.dataReady = true;
            } else if (res.status === 400) {
                console.log()
            } else if (res.status === 404) {
                console.log();
            }
        },
        async fetchMessage(userId, messageId) {
            const url = 'http://localhost:3000/api/social/messages/' + userId + "/" + messageId;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                let messageJson = await res.json();
                this.message = messageJson.message;
                this.dataReady = true;
            } else if (res.status === 400) {
                console.log()
            } else if (res.status === 404) {
                console.log();
            }
        },
    }
}
</script>