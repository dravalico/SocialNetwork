<template>
    <div>
        <div v-if="this.$store.getters.isAuthenticated">
            <div v-if="message.likes.includes(this.$store.getters.userState.user.id)">
                <button class="unlike-btn blank-button mb-3" @click.stop="removeLike">
                    <span>
                        <b-icon-heart-fill></b-icon-heart-fill>
                        {{ message.likes.length }}
                    </span>
                </button>
            </div>
            <div v-else>
                <button class="like-btn blank-button mb-3" @click.stop="addLike">
                    <span>
                        <b-icon-heart></b-icon-heart>
                        {{ message.likes.length }}
                    </span>
                </button>
            </div>
        </div>
        <div v-else>
            <button class="like-btn blank-button mb-3" @click.stop="modal">
                <span>
                    <b-icon-heart></b-icon-heart>
                    {{ message.likes.length }}
                </span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["message"],
    methods: {
        async addLike() {
            const res = await fetchApi("/social/like/" + this.message.id, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                this.$emit("liked-event");
            } else {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        async removeLike() {
            const res = await fetchApi("/social/like/" + this.message.id, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                this.$emit("unliked-event");
            } else {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        modal() {
            this.$emit("auth-event");
        }
    }
}
</script>

<style scoped>
.like-btn:hover {
    color: #F91880
}

.unlike-btn {
    color: #F91880
}
</style>