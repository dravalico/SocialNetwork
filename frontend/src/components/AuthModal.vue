<template>
    <b-modal id="no-auth" hide-header hide-footer>
        <div class="w-75 my-5 mx-auto">
            <p class="mb-4 h4" style="text-align: center;">You must be logged in to <b-icon-heart-fill
                    style="color: #F91880"></b-icon-heart-fill> a message
            </p>
            <p style="font-weight: 300;">
                Sign up or sign in
            </p>
            <router-link class="w-100 modal-btn mb-2 text-center" to="/signup">
                Sign up
            </router-link>
            <router-link class="w-100 modal-btn text-center" to="/signin">
                Sign in
            </router-link>
        </div>
    </b-modal>
</template>

<style scoped>
.modal-btn {
    border-radius: 50rem !important;
    border: 1px solid black;
}

.modal-btn:hover {
    background-color: #f7f9fd;
}

.modal-content {
    border-radius: 50px;
}
</style>