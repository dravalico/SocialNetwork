<template>
    <div class="h-100">
        <div class="guest">
            <h1 class="display-4">Welcome, guest</h1>
            <p>
                Welcome to wpSocial!
                As a guest you can search for users by name, surname and username. You will be able to see all their
                messages and the likes they have received.
            </p>
            <p>You won't be able to like posts, you won't be able to create
                messages and you won't be able to have a personalized feed. For all these actions,
                <a href="/#/signup">register</a>, or if you
                are already registered, <a href="/#/signin">log in</a>.
            </p>
        </div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Main"
}
</script>

<style scoped>
p a {
    display: contents !important;
    text-decoration: none !important;
    color: #007bff !important;
}
</style>