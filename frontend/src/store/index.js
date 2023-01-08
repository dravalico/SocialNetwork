import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const API_BASE = "http://localhost:3000/" + "api/social";
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
            const res = await fetch(API_BASE + "/whoami", {
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
    },
});
