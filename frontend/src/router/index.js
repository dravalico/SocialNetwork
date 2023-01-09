import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index.js";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            title: "Home",
        },
    },
    {
        path: "/signup",
        component: () =>
            import(/* webpackChunkName: "signup" */ "../components/Signup.vue"),
        meta: {
            title: "Sign up",
        },
    },
    {
        path: "/signin",
        component: () =>
            import(/* webpackChunkName: "signin" */ "../components/Signin.vue"),
        meta: {
            title: "Sign in",
        },
    },
    {
        path: "/user",
        component: () =>
            import(/* webpackChunkName: "user" */ "../components/User.vue"),
        meta: {
            title: "User",
        },
    },
    {
        path: "/message",
        component: () =>
            import(
                /* webpackChunkName: "message" */ "../components/Message.vue"
            ),
        meta: {
            title: "Message",
        },
    },
    {
        path: "/post",
        component: () =>
            import(/* webpackChunkName: "post" */ "../components/Post.vue"),
        meta: {
            title: "Create post",
        },
    },
    {
        path: "/followers",
        component: () =>
            import(
                /* webpackChunkName: "followers" */ "../components/Followers.vue"
            ),
        meta: {
            title: "Your followers",
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
