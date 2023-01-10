<template>
    <div class="w-75 mx-auto">
        <h1 class="display-4">Search</h1>
        <div>
            <!---<b-icon icon="search"></b-icon>-->
            <b-form-input id="search-form" class="shadow-none" placeholder="Search users..." v-model="input"
                @input="handleQuery(input)"></b-form-input>
        </div>
        <div id="result-div" v-if="isVisible" class="overflow-auto shadow-sm mb-5 bg-white w-100"
            style="max-height: 10%;">
            <div v-if="!isEmpty">
                <div class="w-100" v-for='user in users' :key='user.id'>
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
            isEmpty: '',
            input: '',
            users: [],
            error: '',
        }
    },
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
            this.input = '';
            const pathTo = "/user";
            if (this.$route.name != pathTo) {
                this.$router.push({ path: pathTo, query: { id: id } }).catch(() => { });
            }
        }
    }
}
</script>