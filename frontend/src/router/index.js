import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import Signup from "../components/Signup.vue";
import Signin from "../components/Signin.vue";
import User from "../components/User.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: Main,
        children: [
            {
                path: "signup",
                component: Signup,
            },
            {
                path: "signin",
                component: Signin,
            },
            {
                path: "user",
                component: User,
            },
        ],
    },
];

const router = new VueRouter({
    routes,
    linkActiveClass: "active-link",
});

export default router;
