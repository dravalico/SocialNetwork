<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <div class="w-75 mx-auto">
            <button class="blank-button" @click="goHome">
                <h1 class="display-4">WPsocial</h1>
            </button>

            <div class="btn-like">
                <router-link class="w-100 no-decoration" to="/">
                    Home
                </router-link>
            </div>
            <div class="btn-like">
                <router-link class="w-100 no-decoration" to="/signup">
                    Sign up
                </router-link>
            </div>
            <div class="btn-like">
                <router-link class="w-100 no-decoration" to="/signin">
                    Sign in
                </router-link>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'GuestMenu',
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