<template>
  <div id="appLogin">
    <div class="container">
      <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
          <LineUp/>
          <div class="card box-shadow2">
            <div class="card-header text-center">
              <h3>Login</h3>
            </div>
            <div class="card-body">
              <form name="loginFrm" id="loginFrm" @submit.prevent="submitFormData">
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-lb">Username/Email:</label>
                      <input type="text" name="username_email" id="usernameEmail" v-model.trim="formData.usernameEmail" class="form-control" placeholder="Username or Email" maxlength="60">
                      <div class="text-danger" v-if="!$v.formData.usernameEmail.required && $v.formData.usernameEmail.$error">Please enter username or email.</div>
                    </div>
                    <div class="form-group mt-3">
                      <label class="form-lb">Password:</label>
                      <input type="password" name="password" id="password" v-model.trim="formData.password" class="form-control" placeholder="Password" maxlength="20">
                      <div class="text-danger" v-if="!$v.formData.password.required && $v.formData.password.$error">Please enter password.</div>
                      <div class="text-danger" v-if="!$v.formData.password.minLength && $v.formData.password.required && $v.formData.password.$error">Minimum 6 chars required.</div>
                    </div>
                  </div>
                  <div class="form-group d-grid mt-3">
                    <button type="submit" class="btn btn-primary" :disabled="isDisabled">Login</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="card-footer text-center">
              <router-link :to="{ name: 'createAccount'}" class="btn btn-default">Create Account?</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineUp from '../components/LineupComponent.vue'
import axios from '../axios'
import { required, minLength } from 'vuelidate/lib/validators'
export default {
  name: 'AppLoginView',
  props: {

  },
  components: {
    LineUp
  },
  data() {
    return {
      formData: {
        usernameEmail: '',
        password: ''
      }
    }
  },
  watch: {
  },
  computed: {
    isDisabled() {
      return !this.formData.usernameEmail || !this.formData.password
    }
  },
  validations: {
    formData: {
      usernameEmail: { required },
      password: { required, minLength: minLength(6) }
    }
  },
  methods: {
    initFormData() {
      var _this = this;
      _this.formData.usernameEmail = '';
      _this.formData.password = '';
    },
    submitFormData() {
      var _this = this;
      _this.$toastr.remove();
      _this.$v.$touch();
      if (_this.$v.$invalid) {
        return;
      }
      _this.signIn();
    },
    async signIn() {
      var _this = this;
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
      await axios({
        method: 'POST',
        url: 'master-user/login',
        data: {
          email_username: _this.formData.usernameEmail,
          password: _this.formData.password
        }
      }).then(function (apiResponse) {
        //local storage clear
        //localStorage.removeItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserInfo');
        localStorage.removeItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserToken');
        _this.$toastr.remove();
        _this.$swal.close();
        //console.log(apiResponse);
        //success - create account
        if(apiResponse.data.status === 200) {
          if(apiResponse.data.body.message != undefined && apiResponse.data.body.message != '') {
            _this.$swal({
              title: '<strong>SignIn Done!</strong>',
              html: apiResponse.data.body.message + '<br/><i><small>Please wait...</small></i>',
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              showCancelButton: false,
              showConfirmButton: false
            });
          }
          _this.initFormData();
          _this.$v.$reset();
          //localStorage.setItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserInfo', JSON.stringify(apiResponse.data.body.content.user));
          //jwt token save in the local storage
          localStorage.setItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signinUserToken', apiResponse.data.body.content.user_token);
          //console.log(apiResponse.data.body.content.user_token);
          //vuex
          _this.$store.commit('setIsLoggedIn', true);
          _this.$store.commit('setAuthUser', apiResponse.data.body.content.user);
          setTimeout(function () {
            _this.$router.push({name: 'taskList'});
          }, 3000);
        } else if(apiResponse.data.status === 203 && apiResponse.data.body.type == "ERROR_VALIDATION") {
          _this.$toastr.error(apiResponse.data.body.message, 'Oops!');
          _this.validationErrors = apiResponse.data.body.content.validation_errors.error_messages;
        } else {
          _this.$toastr.error(apiResponse.data.body.message, 'Oops!');
        }
      }).catch(function (errorResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        if(errorResponse.response.status === 400 && errorResponse.response.data.type == 'success') {
          _this.$toastr.error(errorResponse.response.data.body.message, 'Oops!');
        } else if(errorResponse.response.status === 404) {
          _this.$toastr.error('Something went wrong, Try again.', 'Oops!');
        } else {
          _this.$toastr.error('Something went wrong.', 'SYSTEM ERROR!');
        }
      })
    }
  },
  mounted() {
    var _this = this;

    _this.$toastr.remove();
    _this.$swal.close();
    
    //get all querystrings from url
    let queryStrings = _this.$route.query;
    
    //for detect just signup
    let isJustSignup = localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_justSignup');
    let getSignupUser = localStorage.getItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signupUserInfo');
    if(queryStrings && queryStrings.signup != undefined && isJustSignup && isJustSignup != undefined && isJustSignup == '1' && getSignupUser && getSignupUser != undefined && getSignupUser != '') {
      let signupUserObj = JSON.parse(getSignupUser);
      if(signupUserObj && Object.keys(signupUserObj).length !== 0 && Object.keys(signupUserObj).length != '') {
        _this.$toastr.success('Hi ' + signupUserObj.name + ', Your account has been created successfully, Please login', 'Success!');
        localStorage.removeItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_justSignup');
        localStorage.removeItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signupUserInfo');
      }
    }

    if(queryStrings.logout != undefined && queryStrings.logout != null && queryStrings.logout == 'success') {
      _this.$toastr.success('You have successfully logout', 'Logout!');
    }
    if(queryStrings.auth != undefined && queryStrings.auth != null && queryStrings.auth == 'error') {
      _this.$toastr.error('System detect an unauthorized access', 'Unauthorized Access');
    }
    if(queryStrings.error != undefined && queryStrings.error != null && queryStrings.error == 500) {
      _this.$toastr.error('System detect a server error', 'Oops!');
    }
    if(queryStrings.error != undefined && queryStrings.error != null && queryStrings.error == 401) {
      _this.$toastr.error('Unauthorized access found. Please login', 'Unauthorized');
    }
  }
}
</script>

<style scoped>

</style>

