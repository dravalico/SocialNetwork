<template>
    <div class="h-100">
        <b-container fluid class="h-100">
            <b-row class="h-100">
                <b-col sm="3">
                    <GuestMenu />
                </b-col>
                <b-col class="bordered" sm="6"><router-view /></b-col>
                <b-col align-self="stretch" sm="3">
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import GuestMenu from './GuestMenu.vue';
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Main",
    components: { GuestMenu }
}
</script>

<style scoped>

.bordered{
    border-right: 1px solid #F0F3F4;
    border-left: 1px solid #F0F3F4;
}
</style>