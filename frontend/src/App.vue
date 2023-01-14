<template>
    <div id="app">
        <div v-if="windowWidth <= 768">
            <div>
                <Menu :windowWidth=windowWidth />
            </div>
            <div class="bordered scrollable-col">
                <router-view class="w-75 mx-auto" />
            </div>
        </div>
        <div v-if="windowWidth > 768 && windowWidth <= 992">
            <b-container id="app-container" fluid class="m-0 p-0">
                <b-row>
                    <b-col>
                        <Menu :windowWidth=windowWidth />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="7" class="bordered scrollable-col">
                        <router-view class="w-75 mx-auto" />
                    </b-col>
                    <b-col cols="5" class="scrollable-col">
                        <Search />
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <div v-if="windowWidth > 992">
            <b-container id="app-container" fluid>
                <b-row>
                    <b-col cols="3" class="scrollable-col">
                        <Menu :windowWidth=windowWidth />
                    </b-col>
                    <b-col cols="5" class="bordered scrollable-col">
                        <router-view />
                    </b-col>
                    <b-col cols="4" class="scrollable-col">
                        <Search :windowWidth=windowWidth />
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import Menu from "./views/Menu.vue";
import Search from "./views/Search.vue";

export default {
    name: "App",
    components: {
        Menu,
        Search
    },
    data() {
        return {
            windowWidth: window.innerWidth
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });
    },
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");

html,
body {
    min-height: 100%;
    overflow-x: hidden !important;
    overflow: hidden;
}

#app {
    font-family: "Raleway", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

a {
    display: inline-block;
    color: black !important;
    padding: 10px;
    text-decoration: none !important;
}

.router-link-active {
    background: #fcd5ce;
}

.router-link-exact-active {
    color: #007bff !important;
}

.blank-button {
    border: none;
    background-color: inherit;
}

.blank-button:hover {
    border: none;
    background-color: #f7f9fd;
}

input,
textarea,
button {
    box-shadow: none !important;
}

.bordered-top {
    border-top: 1px solid #F0F3F4;
}

.btn {
    border-radius: 50rem !important;
}

.scrollable-col {
    height: 100vh;
    overflow-y: auto;
}

.bordered {
    border-right: 1px solid #F0F3F4;
    border-left: 1px solid #F0F3F4;
}
</style>
