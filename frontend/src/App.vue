<template>
    <div id="app" class="vh-100">
        <b-container fluid class="vh-100">
            <b-row class="vh-100">
                <b-col sm="3">
                    <Menu />
                </b-col>
                <b-col class="bordered" sm="5">
                    <router-view />
                </b-col>
                <b-col sm="4">
                    <Search />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Menu from './views/Menu.vue';
import Search from './views/Search.vue';

export default {
    name: 'App',
    components: {
        Menu,
        Search
    },
    metaInfo: {
        title: 'wpSocial',
        titleTemplate: '%s | wspSocial'
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

html,
body {
    overflow: hidden;
}

#app {
    font-family: 'Raleway', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
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
    background-color: #edf2fb;
}

input,
textarea,
button {
    box-shadow: none !important;
}

.bordered-top {
    border-top: 1px solid #F0F3F4;
}

.like-btn:hover {
    color: red;
}

.btn {
    border-radius: 50rem !important;
}
</style>
