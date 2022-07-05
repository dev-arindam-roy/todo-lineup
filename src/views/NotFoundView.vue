<template>
    <div id="AppNotFound">
        <h1>Oops! 404 <br/> Page Not Found</h1>
        <div class="mt-5">
            <button class="btn btn-secondary" v-on:click="windowBack">Back</button>
            <button class="btn btn-primary ms-2" v-on:click="backToMyAccount">My Account</button>
        </div>
    </div>
</template>


<script>
export default {
    name: 'NotFoundView',
    props: {
    },
    components: {
    },
    data() {
        return {
        }
    },
    watch: {
        
    },
    computed: {
        
    },
    methods: {
        windowBack() {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
        },
        backToMyAccount() {
            this.$router.push({ name: 'taskList' })
        }
    },
    mounted() {
    }
}
</script>

<style scoped>
#AppNotFound {
    margin: 50px auto;
    text-align: center;
}
h1 {
    color: red;
}
</style>
