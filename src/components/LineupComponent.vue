<template>
    <div id="lineUp">
        <div class="lineup-holder">
            <img src="../assets/lineup.png">
            <h3 class="text-primary mt-2">ToDo - LineUp</h3>
            <label v-if="$store.state.isLoggedIn"><strong>Hi, {{ authName }}</strong></label>
        </div>
    </div>
</template>


<script>
export default {
    name: 'LineupComponent',
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
        authName: function() {
            return this.$store.state.authUser.name
        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>

<style scoped>
.lineup-holder {
    width: 100%;
    text-align: center;
    margin-bottom: 25px;
}
.lineup-holder h3 {
    font-size: 26px;
    font-weight: bold;
}
</style>