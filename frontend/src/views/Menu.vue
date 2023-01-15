<template>
    <div>
        <div v-if="windowWidth <= 992">
            <div>
                <b-navbar toggleable="md" style="background-color: #d5e3ff;" navbar-fixed-top>
                    <b-navbar-brand href="" @click="goHome">!Twitter</b-navbar-brand>
                    <b-navbar-nav>
                        <b-nav-item v-if="windowWidth <= 768">
                            <Search :windowWidth=windowWidth />
                        </b-nav-item>
                    </b-navbar-nav>

                    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                    <b-collapse id="nav-collapse" is-nav>
                        <div v-if="!isAuthenticated">
                            <b-navbar-nav>
                                <b-nav-item>
                                    <router-link to="/">Home</router-link>
                                </b-nav-item>
                                <b-nav-item>
                                    <router-link to="/signup">Sign up</router-link>
                                </b-nav-item>
                                <b-nav-item>
                                    <router-link to="/signin">Sign in</router-link>
                                </b-nav-item>
                            </b-navbar-nav>
                        </div>
                        <div v-else>
                            <b-navbar-nav>
                                <b-nav-item>
                                    <router-link
                                        :to="{ path: '/user', query: { id: this.$store.getters.userState.user.id } }">
                                        Profile
                                    </router-link>
                                </b-nav-item>
                                <b-nav-item>
                                    <router-link
                                        :to="{ path: '/followers', query: { id: this.$store.getters.userState.user.id } }">
                                        My followers
                                    </router-link>
                                </b-nav-item>
                                <b-nav-item>
                                    <router-link to="/post">Create a post</router-link>
                                </b-nav-item>
                                <b-nav-item>
                                    <a href="" @click="logout">Logout</a>
                                </b-nav-item>
                            </b-navbar-nav>
                        </div>
                    </b-collapse>
                </b-navbar>
            </div>
        </div>
        <div v-else class="w-75 mx-auto desktop">
            <button @click="goHome" class="title">
                <span class="display-4">!Twitter</span>
            </button>
            <div v-if="isAuthenticated" class="bordered-top mt-3">
                <div>
                    <h2>
                        {{ this.$store.getters.userState.user.name }} {{ this.$store.getters.userState.user.surname }}
                    </h2>
                    <h5>@{{ this.$store.getters.userState.user.username }}</h5>
                    <div v-if="this.$store.getters.userState.user.bio.length != 0"
                        class="overflow-auto p-3 bg-light font-italic my-3" style=" max-height: 100px;">
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
                <nav>
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
                </nav>
            </div>
            <div v-else class="bordered-top mt-3">
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
import Search from "./Search.vue";

export default {
    data() {
        return {
            isAuthenticated: this.$store.getters.isAuthenticated
        }
    },
    components: {
        Search
    },
    props: ["windowWidth"],
    watch: {
        "$store.getters.isAuthenticated"() {
            this.isAuthenticated = this.$store.getters.isAuthenticated;
        }
    },
    methods: {
        goHome() {
            const pathTo = "/";
            if (this.$route.fullPath != pathTo) {
                this.$router.push({ path: pathTo }).catch(() => { });
            }
        },
        async logout() {
            const res = await fetchApi("/auth/logout", {
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
        openFollowers() {
            this.$router.push({ path: "/followers", query: { id: this.$store.getters.userState.user.id } }).catch(() => { });
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
    height: 2%;
}

#followers-link:hover {
    background-color: #edf2fb;
}

@media screen and (max-width: 992px) {
    a {
        padding: 5px;
    }
}
</style>