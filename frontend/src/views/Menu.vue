<template>
    <div class="w-75 mx-auto">
        <button class="title" @click="goHome">
            <span class="display-4">wpSocial</span>
        </button>
        <div v-if="isAuthenticated" class="bordered-top mt-3">
            <div>
                <h2>
                    {{ this.$store.getters.userState.user.name }} {{ this.$store.getters.userState.user.surname }}
                </h2>
                <h5>@{{ this.$store.getters.userState.user.username }}</h5>
                <div class="overflow-auto p-3 bg-light font-italic my-3" style="max-width: 260px; max-height: 100px;">
                    {{ this.$store.getters.userState.user.bio }}
                </div>
            </div>
            <ul class="list-group mt-2">
                <button type="button"
                    class="d-flex justify-content-between align-items-center list-group-item list-group-item-action"
                    @click.prevent="openFollowers">
                    Followers
                    <span class="badge badge-primary badge-pill">
                        {{ this.$store.getters.userState.user.followers.length }}
                    </span>
                </button>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Following
                    <span class="badge badge-primary badge-pill">{{
                        this.$store.getters.userState.user.following.length
                    }}</span>
                </li>
            </ul>
            <div class="mt-4">
                <div class="btn-like">
                    <router-link class="w-100 no-decoration" to="/post">
                        <span class="h5">Create a post</span>
                    </router-link>
                </div>
                <div class="btn-like">
                    <router-link class="w-100 no-decoration"
                        :to="{ path: '/user', query: { id: this.$store.getters.userState.user.id } }">
                        <span class="h5">View my posts</span>
                    </router-link>
                </div>
            </div>
            <div class="mt-3">
                <button class="btn btn-primary w-100" @click="logout">Logout</button>
            </div>
        </div>
        <div v-else>
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
    data() {
        return {
            isAuthenticated: null
        }
    },
    watch: {
        "$store.getters.isAuthenticated"() {
            this.isAuthenticated = this.$store.getters.isAuthenticated;
        }
    },
    methods: {
        goHome() {
            const pathTo = "/";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo }).catch(() => { });
            }
        },
        async logout() {
            const url = "http://localhost:3000/api/auth/logout";
            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                if (this.$route.name != "Home") {
                    await this.$store.dispatch("logout");
                    this.$router.push({ path: "/" });
                } else {
                    this.$router.go();
                }
            } else if (res.status !== 404) {
                this.$router.push({ path: "/error" }).catch(() => { });
            }
        },
        openMyPosts() {
            const pathTo = "/user";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo, query: { id: this.$store.getters.userState.user.id } }).catch(() => { });
            }

        },
        openFollowers() {
            const pathTo = "/followers";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo, query: { id: this.$store.getters.userState.user.id } }).catch(() => { });
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

.title {
    border: none;
    background-color: inherit;
}

#followers-link:hover {
    background-color: #edf2fb;
}
</style>