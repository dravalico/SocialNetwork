<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <div class="w-75 mx-auto">
            <button class="title" @click="goHome">
                <span class="display-4">wpSocial</span>
            </button>
            <div v-if="isAuthenticated" class="bordered-top mt-3">
                <div>
                    <h2>
                        {{ this.$store.getters.userState.user.name }} {{ this.$store.getters.userState.user.surname }}
                    </h2>
                    <h4>@{{ this.$store.getters.userState.user.username }}</h4>
                    <h4 class="font-italic">{{ this.$store.getters.userState.user.bio }}</h4>
                </div>
                <ul class="list-group mt-2">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Followers
                        <span class="badge badge-primary badge-pill">{{
                            this.$store.getters.userState.user.followers.length
                        }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Following
                        <span class="badge badge-primary badge-pill">{{
                            this.$store.getters.userState.user.following.length
                        }}</span>
                    </li>
                </ul>
                <div class="mt-4">
                    <button class="btn btn-primary w-100 rounded" @click="createPost">Create a post</button>
                </div>
                <div class="mt-1">
                    <button class="btn btn-primary w-100 rounded" @click="openMyPosts">View my posts</button>
                </div>
                <div class="mt-3">
                    <button class="btn btn-primary w-100 rounded" @click="logout">Logout</button>
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
        },
        createPost() {
            const pathTo = "/post";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo }).catch(() => { });
            }
        },
        async logout() {
            const url = 'http://localhost:3000/api/auth/logout';
            const res = await fetch(url, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                const pathTo = "/#/";
                this.$router.push({ path: pathTo }).catch(() => { });
            } else if (res.status === 400) {
                console.log("error")
            } else if (res.status === 404) {
                console.log("error2");
            }
        },
        openMyPosts() {
            const pathTo = "/user";
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

.custom-button {
    background-color: inherit;
}

.blank-button:hover {
    background-color: #dde5b6;
}

.rounded {
    border-radius: 50rem !important;
}
</style>