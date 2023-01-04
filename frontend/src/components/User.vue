<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div v-if="dataReady" class="mx-auto">
        <span>
            <h1 class="display-4">{{ this.user.name }} {{ this.user.surname }}</h1>
            <h3>{{ this.user.username }}</h3>
            <h5 class="font-italic">{{ this.user.bio }}</h5>
        </span>
        <p>
            Followers: {{ this.user.followersNumber }}
            Following: {{ this.user.followingNumber }}
        </p>
        <div id="result-div">
            <div v-if="!isEmpty">
                <div class="w-100" v-for='message in messages' :key='message.id'>
                    <p>
                        {{ message.text }}
                    </p>
                </div>
            </div>
            <div v-else class="w-100">
                No messages yet
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
            handler(idObj) {
                this.dataReady = false;
                this.isEmpty = '';
                this.user = {};
                this.messages = [];
                this.fetchUserData(idObj.id);
                this.fetchUserMessages(idObj.id);
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
                this.user.followersNumber = this.user.followers.length
                this.user.followingNumber = this.user.following.length
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
        }
    }
}
</script>
