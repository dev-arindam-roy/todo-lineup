<template>
  <div id="appAddTask">
    <div class="container mt-3">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <LineUp/>
          <div class="card">
            <div class="card-header text-center">
              <h3>Create New Task</h3>
            </div>
            <form name="loginFrm" id="loginFrm" @submit.prevent="submitFormData">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <ValidationErrors :validationErrorListArr="validationErrors" class="mb-1"></ValidationErrors>
                    <div class="form-group">
                      <label class="form-lb">Task Name: <em>*</em></label>
                      <input type="text" name="task_name" id="taskName" v-model.trim="formData.taskName" class="form-control" placeholder="Task Name">
                      <div class="text-danger" v-if="!$v.formData.taskName.required && $v.formData.taskName.$error">Please enter task name.</div>
                      <div class="text-danger" v-if="!$v.formData.taskName.minLength && $v.formData.taskName.required && $v.formData.taskName.$error">Please enter atleast 3 chars.</div>
                    </div>
                    <div class="form-group mt-3">
                      <label class="form-lb">Task Details:</label>
                      <textarea name="task_details" id="taskDetails" v-model.trim="formData.taskDetails" class="form-control" placeholder="Task Details"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <button type="submit" class="btn btn-primary btn-sm" :disabled="isDisabled" v-if="!isEditModeOn">Add</button>
                <button type="submit" class="btn btn-success btn-sm" :disabled="isDisabled" v-if="isEditModeOn">Update</button>
                <button type="button" class="ms-2 btn btn-danger btn-sm" v-if="isEditModeOn" @click="deleteTask()">Delete</button>
                <router-link :to="{ name: 'taskList'}" class="ms-2 btn btn-secondary btn-sm">List</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineUp from '../../components/LineupComponent.vue'
import ValidationErrors from '../../components/ValidationErrorsComponent.vue'
import axios from '../../axios'
import { required, minLength } from 'vuelidate/lib/validators'
export default {
  name: 'AppAddTaskView',
  props: {

  },
  components: {
    LineUp,
    ValidationErrors
  },
  data() {
    return {
      validationErrors: [],
      userId: '',
      formData: {
        taskName: '',
        taskDetails: ''
      },
      isEditModeOn: false,
      taskId: 0
    }
  },
  watch: {
  },
  computed: {
    isDisabled() {
      return !this.formData.taskName
    }
  },
  validations: {
    formData: {
      taskName: { required, minLength: minLength(3) }
    }
  },
  methods: {
    initFormData() {
      var _this = this;
      _this.formData.taskName = '';
      _this.formData.taskDetails = '';
    },
    submitFormData() {
      var _this = this;
      _this.$toastr.remove();
      _this.$v.$touch();
      if (_this.$v.$invalid) {
        _this.formValidation();
        return;
      }
      if(_this.isEditModeOn && _this.taskId != 0 && _this.taskId != '' && _this.taskId != null) {
        _this.updateTask();
      } else {
        _this.createTask();
      }
    },
    formValidation() {
      var _this = this;
      if(!_this.$v.formData.taskName.required && _this.$v.formData.taskName.$error) {
        _this.$toastr.error('Please enter task name.', 'Oops');
      } else if(!_this.$v.formData.taskName.minLength && _this.$v.formData.taskName.required && _this.$v.formData.taskName.$error) {
        _this.$toastr.error('Please enter atleast 3 chars.', 'Error');
      }
    },
    async createTask() {
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
        url: 'task-lineup/create',
        data: {
          name: _this.formData.taskName,
          description: _this.formData.taskDetails,
          user_id: _this.userId
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        //console.log(apiResponse);
        //success - create account
        if(apiResponse.data.status === 200) {
          if(apiResponse.data.body.message != undefined && apiResponse.data.body.message != '') {
            _this.$swal({
              title: '<strong>Done!</strong>',
              html: apiResponse.data.body.message,
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              showCancelButton: true,
              showConfirmButton: true,
              cancelButtonColor: '#198754',
              confirmButtonText: "Check List?",
              cancelButtonText: "Add Another?"
            }).then((result) => {
              if (result.isConfirmed) {
                _this.$router.push({name: 'taskList'});
              }
              if (result.dismiss === _this.$swal.DismissReason.cancel) {
                document.getElementById('taskName').focus();
              }
            });
          }
          _this.initFormData();
          _this.$v.$reset();
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
    },
    async updateTask() {
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
        method: 'PUT',
        url: 'task-lineup/update',
        data: {
          name: _this.formData.taskName,
          description: _this.formData.taskDetails,
          user_id: _this.userId,
          task_id: _this.taskId
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        //console.log(apiResponse);
        //success - create account
        if(apiResponse.data.status === 200) {
          if(apiResponse.data.body.message != undefined && apiResponse.data.body.message != '') {
            _this.$swal({
              title: '<strong>Done!</strong>',
              html: apiResponse.data.body.message,
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: "Check List?",
            }).then((result) => {
              if (result.isConfirmed) {
                _this.$router.push({name: 'taskList'});
              }
            });
          }
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
    },
    getUserId() {
      var _this = this;
      _this.userId = _this.$store.state.authUser.id;
    },
    async checkEditMode() {
      var _this = this;
      if(_this.$route.params.id && _this.$route.params.id != undefined && _this.$route.params.id != null) {
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
          url: 'task-lineup/view/' + _this.$route.params.id,
          data: {
            user_id: _this.userId,
            task_id: _this.$route.params.id
          }
        }).then(function (apiResponse) {
          _this.$toastr.remove();
          _this.$swal.close();
          if(apiResponse.data.status === 200) {
            _this.formData.taskName = apiResponse.data.body.content.todo.name ?? '';
            _this.formData.taskDetails = apiResponse.data.body.content.todo.description ?? '';
            _this.taskId = apiResponse.data.body.content.todo.id ?? 0;
            _this.isEditModeOn = true;
          } else {
            _this.$toastr.error(apiResponse.data.body.message, 'Oops!');
            setTimeout(function () {
              _this.$router.push({name: 'taskList'});
            }, 3000);
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
          _this.$router.go(-1);
        });
      }
    },
    async deleteTask() {
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
      if(_this.userId != 0 && _this.userId != '' && _this.userId != null && _this.taskId != 0 && _this.taskId != '' && _this.taskId != null) {
        await axios({
          method: 'DELETE',
          url: 'task-lineup/delete',
          data: {
            user_id: _this.userId,
            task_id: _this.taskId
          }
        }).then(function (apiResponse) {
          _this.$toastr.remove();
          _this.$swal.close();
          if(apiResponse.data.status === 200) {
            _this.$swal({
              title: '<strong>Done!</strong>',
              html: apiResponse.data.body.message + '<br/>Please wait...',
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else {
            _this.$toastr.error(apiResponse.data.body.message, 'Oops!');
          }
          setTimeout(function () {
            _this.$router.push({name: 'taskList'});
          }, 3000);
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
        });
      }
    }
  },
  mounted() {
    var _this = this;
    _this.$toastr.remove();
    _this.$swal.close();
    _this.getUserId();
    if(_this.userId == '' || _this.userId == null) {
      _this.$router.push({ name : 'logout' })
    }
    _this.checkEditMode();
  }
}
</script>

<style scoped>

</style>
