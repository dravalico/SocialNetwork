<template>
    <button class="blank-button w-100 text-left">
        <UserBtn :user="user"/>
        <p class="mt-2 ml-3" style="font-weight: 600;">{{ message.text }}</p>
        {{ message.date.split("T")[0] }}
        <Like :message="message" @liked-event="forwardLikeEvent" @unliked-event="forwardUnikeEvent"
            @auth-event="forwardAuthEvent" />
    </button>
</template>

<script>
import Like from "./Like.vue";
import UserBtn from "./UserBtn.vue";

export default {
    components: {
        Like,
        UserBtn
    },
    props: ["message", "user"],
    methods: {
        openMessage(userId, messageId) {
            this.$router.push({ path: "/message", query: { userId: userId, messageId: messageId } });
        },
        forwardLikeEvent() {
            this.$emit("forwarded-liked-event");
        },
        forwardUnikeEvent() {
            this.$emit("forwarded-unliked-event");
        },
        forwardAuthEvent() {
            this.$emit("forwarded-auth-event");
        }
    }
}
</script>