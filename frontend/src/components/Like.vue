<template>
    <div>
        <div v-if="this.$store.getters.isAuthenticated">
            <div v-if="message.likes.includes(this.$store.getters.userState.user.id)">
                <button class="blank-button mb-3" @click.stop="removeLike">
                    <span>
                        <b-icon-heart-fill style="color:red"></b-icon-heart-fill>
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
    props: ['message'],
    methods: {
        async addLike() {
            const url = 'http://localhost:3000/api/social/like/' + this.message.id;
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                this.$emit('liked-event');
            } else if (res.status === 400) {
                console.log()
            } else if (res.status === 404) {
                console.log();
            }
        },
        async removeLike() {
            const url = 'http://localhost:3000/api/social/like/' + this.message.id;
            const res = await fetch(url, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                this.$emit('unliked-event');
            } else if (res.status === 400) {
                console.log()
            } else if (res.status === 404) {
                console.log();
            }
        },
        modal() {
            this.$emit('auth-event');
        }
    }
}
</script>

<style scoped>
.like-btn:hover {
    color: red;
}
</style>