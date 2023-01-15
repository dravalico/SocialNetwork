<template>
    <div id="wrapper">
        <div v-if="windowWidth > 768">
            <h1 class="display-4">Search</h1>
        </div>
        <div>
            <b-form-input id="search-form" class="shadow-none" placeholder="Search users..." v-model="input"
                @input="handleQuery(input)" @blur="handleBlur"></b-form-input>
        </div>
        <div id="result-div" v-if="isVisible" class="overflow-auto shadow-sm mb-5 bg-white">
            <div v-if="!isEmpty">
                <div class="w-100" v-for="user in users" :key="user.id">
                    <button class="text-left blank-button w-100 py-3 px-3" @click="openUser(user.id)">
                        <span style="font-weight: bold;">{{ user.name }} {{ user.surname }}</span>
                        <br>
                        <span>@{{ user.username }}</span>
                    </button>
                </div>
            </div>
            <div v-else class="w-100 py-3 px-3">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isVisible: false,
            isEmpty: true,
            input: "",
            users: [],
            error: "",
        }
    },
    props: ["windowWidth"],
    methods: {
        handleQuery(input) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const xhrJson = JSON.parse(xhr.responseText);
                        const users = xhrJson.users;
                        this.users = users;
                        this.isEmpty = false;
                        this.isVisible = true;
                    } else if (xhr.status === 404) {
                        this.error = "No match";
                        this.isEmpty = true;
                        this.isVisible = true;
                    } else {
                        this.error = "Something went wrong. Try again.";
                        this.isEmpty = true;
                        this.isVisible = false;
                    }
                }
            };
            const URL = "http://localhost:3000/api/social/search?q=".concat(input)
            xhr.open("GET", URL, true);
            xhr.send();
        },
        openUser(id) {
            this.isVisible = false;
            this.input = "";
            const pathTo = "/user?id=" + id;
            if (this.$route.fullPath != pathTo) {
                this.$router.push({ path: pathTo, query: { id: id } }).catch(() => { });
            }
        },
        handleBlur() {
            setTimeout(() => {
                this.isVisible = false;
            }, 150);
        }
    }
}
</script>

<style scoped>
#wrapper {
    width: 75%;
    margin-left: auto;
    margin-right: auto;
}

@media screen and (min-width: 768px) {
    #result-div {
        width: 100%;
        max-height: 400px;
    }
}

@media screen and (max-width: 768px) {
    #result-div {
        width: 40%;
        max-height: 275px;
        position: absolute;
    }
}
</style>