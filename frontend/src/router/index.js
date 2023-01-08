import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../components/Signup.vue";
import Signin from "../components/Signin.vue";
import User from "../components/User.vue";
import Message from "../components/Message.vue";
import store from "../store/index.js";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: Home,
        meta: {
            title: "Home",
        },
    },
    {
        path: "/signup",
        component: Signup,
        meta: {
            title: "Sign up",
        },
    },
    {
        path: "/signin",
        component: Signin,
        meta: {
            title: "Sign in",
        },
    },
    {
        path: "/user",
        component: User,
        meta: {
            title: "User",
        },
    },
    {
        path: "/message",
        component: Message,
        meta: {
            title: "Message",
        },
    },
];

const router = new VueRouter({
    routes,
    linkActiveClass: "active-link",
});

router.afterEach((to) => {
    Vue.nextTick(() => {
        document.title = to.meta.title
            ? to.meta.title + " / wpSocial"
            : "wpSocial";
    });
});

router.beforeEach(async (to, from, next) => {
    await store.dispatch("verifyAuthentication");
    next();
});

export default router;
