<template>
    <div id="app">
        <b-container id="app-container" fluid>
            <b-row>
                <b-col cols="12" md="3" class="scrollable-col">
                    <Menu />
                </b-col>
                <b-col cols="12" md="5" class="bordered scrollable-col">
                    <router-view />
                </b-col>
                <b-col cols="12" md="4" class="scrollable-col">
                    <Search />
                </b-col>
            </b-row>
        </b-container>
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
    metaInfo: {
        title: "wpSocial",
        titleTemplate: "%s | wspSocial"
    }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");

html,
body {
    min-height: 100%;
}

.scrollable-col {
}

#app {
    font-family: "Raleway", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.bordered {
    border-right: 1px solid #F0F3F4;
    border-left: 1px solid #F0F3F4;
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

@media only screen and (min-width: 992px) {
    body {
        overflow: scroll
    }
}
</style>
