import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'

import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'

Vue.config.productionTip = false

Vue.use(Vuelidate)

//Toastr
window.toastr = require('toastr')
var toastrConfigs = {
  newestOnTop: true,
  positionClass: 'toast-top-right',
  showDuration: 1000,
  timeOut: 5000,
  preventDuplicates: true,
  closeButton: true,
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
  progressBar: true
}
Vue.use(VueToastr2, toastrConfigs)

//Sweet Alert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import store from './store'

const options = {
    confirmButtonColor: '#0d6efd',
    cancelButtonColor: '#cc1f00',
};
Vue.use(VueSweetalert2, options);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
