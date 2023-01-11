import Vue from "vue";
import Vuex from "vuex";

// https://github.com/gabbyprecious/vue-blog/blob/master/src/store/modules/auth.js
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: null,
        isAuthenticated: null,
    },
    getters: {
        isAuthenticated: (state) => !!state.user,
        userState: (state) => state.user,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        async verifyAuthentication() {
            const res = await fetchApi("/social/whoami", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                let user = await res.json();
                this.commit("setUser", user);
            } else {
                this.commit("setUser", null);
            }
        },
        logout() {
            this.commit("setUser", null);
        },
    },
});
