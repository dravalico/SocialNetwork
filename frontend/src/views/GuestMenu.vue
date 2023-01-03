<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <div class="w-75 mx-auto">
            <h1 class="display-4">Social?</h1>
            <b-button pill block variant="outline-primary" @click="goHome()">Home</b-button>
            <b-button pill block variant="outline-primary" @click="signup()">Sign up</b-button>
            <b-button pill block variant="outline-primary" @click="signin()">Sign in</b-button>
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
        },
        signup() {
            const pathTo = "signup";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo }).catch(() => { });
            }
        },
        signin() {
            const pathTo = "signin";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo }).catch(() => { });
            }
        },
    }
}
</script>