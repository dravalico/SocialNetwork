<template>
  <div id="app" class="h-100">
    <!-- website content -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans&display=swap');

html,
body {
  font-family: 'DM Sans', sans-serif;
  height: 100%;
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
</style>
