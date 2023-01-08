<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <div class="w-75 mx-auto">
            <button class="blank-button" @click="goHome">
                <span class="display-4">wpSocial</span>
            </button>
            <div class="btn-like">
                <router-link class="w-100 no-decoration" to="/">
                    <span class="h5">Home</span>
                </router-link>
            </div>
            <div class="btn-like">
                <router-link class="w-100 no-decoration" to="/signup">
                    <span class="h5">Sign up</span>
                </router-link>
            </div>
            <div class="btn-like">
                <router-link class="w-100 no-decoration" to="/signin">
                    <span class="h5">Sign in</span>
                </router-link>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'GuestMenu',
    data() {
        return {
            isAuthenticated: null
        }
    },
    watch: {
        '$store.getters.isAuthenticated'() {
            this.isAuthenticated = this.$store.getters.isAuthenticated;
        }
    },
    methods: {
        goHome() {
            const pathTo = "/";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo }).catch(() => { });
            }
        }
    }
}
</script>

<style scoped>
.btn-like {
    border-radius: 25px;
    background: inherit;
}

.btn-like:hover {
    border-radius: 25px;
    background: #F0F3F4;
}
</style>