<template>
  <div id="appTaskList">
    <div class="container mt-3">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <LineUp/>
          <div class="card">
            <div class="card-header">
              <form name="loginFrm" id="loginFrm" @submit.prevent="submitSearch">
                <div class="row">
                  <div class="col-md-12">
                    <input type="text" name="search_text" v-model.trim="searchText" id="searchText" class="form-control" placeholder="Search...">
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-md-6">
                    <button type="submit" class="btn btn-sm btn-secondary" :disabled="isSearchDisabled">Search</button>
                    <router-link :to="{ name: 'addTask'}" class="ms-2 btn btn-sm btn-primary">Add Task</router-link>
                    <button type="button" class="ms-2 btn btn-sm btn-success" @click="reload()">Reload</button>
                    <label class="ms-3"><strong>({{totalTasks}})</strong></label>
                  </div>
                  <div class="col-md-6 actionbox" style="text-align: right;">
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteAll()">Delete All</button>
                    <button type="button" class="ms-2 btn btn-sm btn-primary" @click="closeAll()">Close All</button>
                    <button type="button" class="ms-2 btn btn-sm btn-warning" @click="logout()">Logout</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <table class="table table-bordered table-striped tasktable">
                      <tbody v-if="taskList.length > 0">
                        <tr v-for="(todo, index) in taskList" :key="todo.id">
                          <td>
                            <router-link class="nodecoration" :to="{name: 'editTask', params: {id: todo.id}}">
                              <span class="badge bg-primary">{{ index + 1}}</span><span class="ms-2 taskname"><strong>{{ todo.name }}</strong></span>
                              <div v-if="todo.description != ''" class="taskdesc">{{ todo.description }}</div>
                            </router-link>
                          </td>
                          <td class="text-center" style="width: 70px;">
                            <button type="button" class="btn btn-sm btn-success" @click="taskComplete(todo)">Done</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import LineUp from '../../components/LineupComponent.vue'
import axios from '../../axios'
export default {
  name: 'AppTaskListView',
  props: {

  },
  components: {
    LineUp
  },
  data() {
    return {
      userId: '',
      taskList: {},
      searchText: ''
    }
  },
  watch: {
  },
  computed: {
    totalTasks: function() {
      return this.taskList.length ?? 0
    },
    isSearchDisabled: function() {
      return !this.searchText
    }
  },
  methods: {
    async getTasks() {
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
        url: 'task-lineup',
        data: {
          user_id: _this.userId
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        if(apiResponse.data.status === 200) {
          _this.taskList = apiResponse.data.body.content.todos;
          if(_this.taskList.length == 0) {
            _this.$toastr.info('Task bucket is empty, Please create task.', 'Oh!');
          }
          if(_this.taskList.length > 0) {
            _this.$toastr.success('You have ' + _this.taskList.length + ' tasks in your bucket', 'Hmm!');
          }
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
      });
    },
    taskComplete(todoObj) {
      var _this = this;
      _this.$swal({
        title: '<strong>Is it Completed?</strong>',
        icon: 'question',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#198754',
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          _this.taskCompleteProcess(todoObj);
        }
        if (result.dismiss === _this.$swal.DismissReason.cancel) {
          console.log('ok');
        }
      });
    },
    async taskCompleteProcess(todoObj) {
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
          user_id: _this.userId,
          task_id: todoObj.id,
          name: todoObj.name,
          status: 1
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        if(apiResponse.data.status === 200) {
          let index = _this.taskList.indexOf(todoObj);
          _this.taskList.splice(index, 1);
          _this.$swal({
            title: '<strong>Completed!</strong>',
            html: apiResponse.data.body.message,
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "OK",
          });
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
      });

    },
    getUserId() {
      var _this = this;
      _this.userId = _this.$store.state.authUser.id;
    },
    logout() {
      this.$router.push({ name : 'logout' })
    },
    async deleteAll() {
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
        url: 'task-lineup/delete-all',
        data: {
          user_id: _this.userId
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        if(apiResponse.data.status === 200) {
          _this.taskList = {};
          _this.$toastr.success(apiResponse.data.body.message, 'All Deleted!');
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
      });
    },
    async closeAll() {
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
        url: 'task-lineup/close-all',
        data: {
          user_id: _this.userId
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        if(apiResponse.data.status === 200) {
          _this.taskList = {};
          _this.$toastr.success(apiResponse.data.body.message, 'All Closed!');
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
      });
    },
    async submitSearch() {
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
        url: 'task-lineup/search',
        data: {
          user_id: _this.userId,
          search_text: _this.searchText
        }
      }).then(function (apiResponse) {
        _this.$toastr.remove();
        _this.$swal.close();
        if(apiResponse.data.status === 200) {
          _this.taskList = apiResponse.data.body.content.todos;
          if(_this.taskList.length == 0) {
            _this.$toastr.info('Sorry, no task found', 'Oh!');
          }
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
      });
    },
    reload() {
      var _this = this
      _this.searchText = ''
      _this.getTasks()
    }
  },
  mounted() {
    var _this = this;
    _this.$toastr.remove();
    _this.$swal.close();
    _this.getUserId();
    if(_this.userId == 0 || _this.userId == '' || _this.userId == null) {
      _this.logout();
    } else {
      _this.getTasks();
    }
  }
}
</script>

<style scoped>
.tasktable tbody tr td {
  font-size: 14px;
}
div.taskdesc {
  font-size: 12px;
  color: #5e5e5e;
}
a.nodecoration {
  text-decoration: none;
}
.taskname {
  color: #000;
}

@media only screen and (max-width: 768px) {
  .actionbox {
    text-align: left !important;
    margin-top: 6px;
    display: inline;
  }
}

@media only screen and (max-width: 992px) {
  .actionbox {
    margin-top: 6px;
    display: inline-block;
  }
}
</style>