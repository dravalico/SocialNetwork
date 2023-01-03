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
  text-align: center;
  color: #2c3e50;
}
</style>
