<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        {{ message.text }}
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Message',
    data() {
        return {
            dataReady: false,
            message: {}
        }
    },
    watch: {
        '$route.query': {
            handler(obj) {
                this.dataReady = false;
                this.fetchMessage(obj.userId, obj.messageId);
            },
            immediate: true,
        }
    }, methods: {
        async fetchMessage(userId, messageId) {
            const url = 'http://localhost:3000/api/social/messages/' + userId + "/" + messageId;
            console.log(url);
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
