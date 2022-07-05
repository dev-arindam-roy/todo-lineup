<template>
    <div id="appLogout">
        
    </div>
</template>



<script>
export default {
    name: 'LogoutView',
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
    },
    mounted() {
        var _this = this;
        _this.$toastr.remove();
        _this.$swal.close();
        _this.$swal({
            title: 'Please Wait...',
            didOpen: () => {
            _this.$swal.showLoading()
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: false,
            showConfirmButton: false
        });
        localStorage.removeItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserToken');
        _this.$store.commit('setIsLoggedIn', false);
        _this.$store.commit('setAuthUser', {});
        _this.$router.push({name: 'root', query: {logout: 'success'} });
    }
}
</script>
