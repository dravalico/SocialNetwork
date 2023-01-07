<template>
    <div id="app" class="h-100">
        <b-container fluid class="h-100">
            <b-row class="h-100">
                <b-col md="3">
                    <GuestMenu />
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
import GuestMenu from './views/GuestMenu.vue';
import Search from './views/Search.vue';

export default {
    name: 'App',
    components: {
        GuestMenu,
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
    height: 100%;
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
    text-decoration: none !important;
    color: black !important;
    padding: 10px;
}

.router-link-active {
    background: #fcd5ce;
}

.router-link-exact-active {
    color: #6b9080 !important;
}

.blank-button {
    border: none;
    background-color: inherit;
}

.blank-button:hover {
    border: none;
    background-color: #dde5b6;
}

input,
textarea {
    box-shadow: none !important;
}

input:focus {
    border: black 1px solid !important;
}

textarea:focus {
    border: black 1px solid !important;
}

.bordered-top {
    border-top: 1px solid #8bcac0;
}

.like-btn:hover {
    color: red;
}
</style>
