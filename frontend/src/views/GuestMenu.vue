<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <b-button pill block variant="outline-primary" @click="signup()">Sign up</b-button>
        <b-button pill block variant="outline-primary" @click="signin()">Sign in</b-button>
    </div>
</template>
  
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'GuestMenu',
    methods: {
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
>