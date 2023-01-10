<template>
    <div class="mx-auto vh-100">
        <span>
            <h1 class="display-4">Message</h1>
        </span>
        <span>
            <button class="text-left user-btn" @click="openUser">
                <h4 id="person">{{ this.user.name }} {{ this.user.surname }}</h4>
                <h5>@{{ this.user.username }}</h5>
            </button>
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
                <Like :message="message" @liked-event="reloadData" @unliked-event="reloadData"
                    @auth-event="showModal" />
            </div>
        </div>
        <Modal />
    </div>
</template>

<script>
import Like from './Like.vue';
import Modal from './Modal.vue';

export default {
    components: {
        Like,
        Modal
    },
    data() {
        return {
            user: {},
            message: {}
        }
    },
    watch: {
        '$route.query': {
            handler(obj) {
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
            } else if (res.status === 400) {
                console.log()
            } else if (res.status === 404) {
                console.log();
            }
        },
        async reloadData() {
            await this.fetchMessage(this.user.id, this.message.id);
        },
        showModal() {
            this.$bvModal.show('no-auth')
        },
        openUser() {
            const pathTo = "/user";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo, query: { id: this.user.id } }).catch(() => { });
            }
        }
    }
}
</script>

<style scoped>
#person:hover {
    text-decoration: underline !important;
}

.user-btn {
    background: inherit;
    border: none;
}
</style>