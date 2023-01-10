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
            requiresAuth: false,
        },
    },
    {
        path: "/signup",
        component: () =>
            import(/* webpackChunkName: "signup" */ "../components/Signup.vue"),
        meta: {
            title: "Sign up",
            requiresAuth: false,
        },
    },
    {
        path: "/signin",
        component: () =>
            import(/* webpackChunkName: "signin" */ "../components/Signin.vue"),
        meta: {
            title: "Sign in",
            requiresAuth: false,
        },
    },
    {
        path: "/user",
        component: () =>
            import(/* webpackChunkName: "user" */ "../components/User.vue"),
        meta: {
            title: "User",
            requiresAuth: false,
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
            requiresAuth: false,
        },
    },
    {
        path: "/post",
        component: () =>
            import(/* webpackChunkName: "post" */ "../components/Post.vue"),
        meta: {
            title: "Create post",
            requiresAuth: true,
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
            requiresAuth: true,
        },
    },
    {
        path: "/error",
        component: () =>
            import(/* webpackChunkName: "error" */ "../components/Error.vue"),
        meta: {
            title: "Oops",
            requiresAuth: false,
        },
    },
    {
        path: "*",
        component: Home,
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
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        alert("You need to be logged in");
        next("/signin");
        return;
    }
    if (store.getters.isAuthenticated) {
        if (to.path === "/signup" || to.path === "/signin") {
            alert(
                "Logout to be able to register a new one or access an existing one"
            );
            next("/");
            return;
        }
    }
    next();
});

export default router;
