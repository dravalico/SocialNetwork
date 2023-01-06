<template>
  <div id="app" class="h-100">
    <!-- website content -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
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
  color: #e63946 !important;
}

.blank-button {
  border: none;
  background-color: inherit;
}

.blank-button:hover {
  border: none;
  background-color: #fbfafa;
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
</style>
