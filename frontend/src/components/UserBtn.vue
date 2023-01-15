<template>
    <div>
        <button class="text-left user-btn" @click.stop.prevent="openUser">
            <h5 id="person">{{ user.name }} {{ user.surname }}</h5>
            <h6>@{{ user.username }}</h6>
        </button>
    </div>
</template>

<script>
export default {
    props: ["user"],
    methods: {
        openUser() {
            const pathTo = "/user?id=" + this.user.id;
            if (this.$route.fullPath != pathTo) {
                this.$router.push({ path: "/user", query: { id: this.user.id } }).catch(() => { });
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
