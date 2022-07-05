<template>
  <div id="appCreateAccount">
    <div class="container">
      <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
          <LineUp/>
          <div class="card box-shadow2">
            <div class="card-header text-center">
              <h3>Create Account</h3>
            </div>
            <div class="card-body">
              <form name="createAccountFrm" id="createAccountFrm" @submit.prevent="submitFormData">
                <ValidationErrors :validationErrorListArr="validationErrors" class="mb-1"></ValidationErrors>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label class="form-lb">Name: <em>*</em></label>
                      <input type="text" name="full_name" id="fullName" v-model.trim="formData.fullName" class="form-control" placeholder="Name" maxlength="20">
                      <div class="text-danger" v-if="!$v.formData.fullName.required && $v.formData.fullName.$error">Please enter your name.</div>
                      <div class="text-danger" v-if="!$v.formData.fullName.validName && $v.formData.fullName.required && $v.formData.fullName.$error">Please enter valid name.</div>
                      <div class="text-danger" v-if="!$v.formData.fullName.minLength && $v.formData.fullName.validName && $v.formData.fullName.required && $v.formData.fullName.$error">Please enter atleast 3 chars.</div>
                    </div>
                    <div class="form-group mt-3">
                      <label class="form-lb">Email: <em>*</em></label>
                      <input type="text" name="email" id="email" v-model.trim="formData.emailAddress" class="form-control" placeholder="Email" maxlength="60">
                      <div class="text-danger" v-if="!$v.formData.emailAddress.required && $v.formData.emailAddress.$error">Please enter your email.</div>
                      <div class="text-danger" v-if="!$v.formData.emailAddress.email && $v.formData.emailAddress.required && $v.formData.emailAddress.$error">Please enter valid email-id.</div>
                    </div>
                    <div class="form-group mt-3">
                      <label class="form-lb">Password: <em>*</em></label>
                      <input type="password" name="password" id="password" v-model.trim="formData.password" class="form-control" placeholder="Password" maxlength="12">
                      <div class="text-danger" v-if="!$v.formData.password.required && $v.formData.password.$error">Please enter password.</div>
                      <div class="text-danger" v-if="!$v.formData.password.minLength && $v.formData.password.required && $v.formData.password.$error">Please enter atleast 6 chars.</div>
                    </div>
                  </div>
                  <div class="form-group mt-3 d-grid mt-3">
                    <button type="submit" class="btn btn-primary" :disabled="isDisabled">Create Account</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="card-footer text-center">
              <router-link :to="{ name: 'root'}" class="btn btn-default">Login?</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineUp from '../components/LineupComponent.vue'
import ValidationErrors from '../components/ValidationErrorsComponent.vue'
import axios from '../axios'
import { required, minLength, email } from 'vuelidate/lib/validators'
const validName = (value) => {
  if (value == '') return true
  if (value != '') {
    return /^[A-Z a-z]+$/.test(value)
  }
}
export default {
  name: 'AppCreateAccountView',
  props: {

  },
  components: {
    LineUp,
    ValidationErrors
  },
  data() {
    return {
      validationErrors: [],
      formData: {
        fullName: '',
        emailAddress: '',
        password: ''
      }
    }
  },
  watch: {
  },
  computed: {
    isDisabled() {
      return !this.formData.fullName || !this.formData.emailAddress || !this.formData.password
      //return this.$v.$invalid
    }
  },
  validations: {
    formData: {
      fullName: { required, validName, minLength: minLength(3) },
      emailAddress: { required, email },
      password: { required, minLength: minLength(6) }
    }
  },
  methods: {
    initFormData() {
      var _this = this;
      _this.formData.fullName = '';
      _this.formData.emailAddress = '';
      _this.formData.password = '';
    },
    submitFormData() {
      var _this = this;
      _this.$toastr.remove();
      _this.$v.$touch();
      if (_this.$v.$invalid) {
        _this.formValidation();
        return;
      }
      _this.$toastr.success('All informations showing valid. Processing...', 'Valid');
      setTimeout(function () {
         _this.createAccount();
      }, 2000);
    },
    formValidation() {
      var _this = this;
      if(!_this.$v.formData.fullName.required && _this.$v.formData.fullName.$error) {
        _this.$toastr.error('Please enter your name.', 'Oops');
      } else if(!_this.$v.formData.fullName.validName && _this.$v.formData.fullName.required && _this.$v.formData.fullName.$error) {
        _this.$toastr.error('Please enter valid name.', 'Error');
      } else if(!_this.$v.formData.fullName.minLength && _this.$v.formData.fullName.validName && _this.$v.formData.fullName.required && _this.$v.formData.fullName.$error) {
        _this.$toastr.error('Name contains atleast 3 chars.', 'Error');
      } else if(!_this.$v.formData.emailAddress.required && _this.$v.formData.emailAddress.$error) {
        _this.$toastr.error('Please enter your email.', 'Oops');
      } else if(!_this.$v.formData.emailAddress.email && _this.$v.formData.emailAddress.required && _this.$v.formData.emailAddress.$error) {
        _this.$toastr.error('Please enter valid email-id.', 'Error');
      } else if(!_this.$v.formData.password.required && _this.$v.formData.password.$error) {
        _this.$toastr.error('Please enter your password.', 'Oops');
      } else if(!_this.$v.formData.password.minLength && _this.$v.formData.password.required && _this.$v.formData.password.$error) {
        _this.$toastr.error('Password contains atleast 6 chars.', 'Error');
      }
    },
    async createAccount() {
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
        url: 'master-user/create',
        data: {
          name: _this.formData.fullName,
          email: _this.formData.emailAddress,
          password: _this.formData.password
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        //console.log(apiResponse);
        //success - create account
        if(apiResponse.data.status === 200 && apiResponse.data.type == 'success') {
          if(apiResponse.data.body.message != undefined && apiResponse.data.body.message != '') {
            _this.$swal({
              title: '<strong>Congratulations</strong>',
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
          localStorage.setItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_justSignup', '1');
          localStorage.setItem(process.env.VUE_APP_BROWSER_STORAGE_KEY + '_signupUserInfo', JSON.stringify(apiResponse.data.body.content.user));
          setTimeout(function () {
            _this.$router.push({name: 'root', query: {signup: 'success'} });
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
    
  }
}
</script>

<style scoped>

</style>


