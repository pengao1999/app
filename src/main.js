import Vue from 'vue'
import moment from 'moment'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import store from './store'
import http from './common/js/request.js'
import cache from './common/js/Cache.js'
import SpringRequest from './common/js/SpringRequest.js'
// import request from './utils/request'

VueClipboard.config.autoSetContainer = true
Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$cache = cache
Vue.prototype.$event = new Vue()
Vue.prototype.$Phttp = SpringRequest
// Vue.prototype.$request = request;
App.mpType = 'app'

Vue.use(VueClipboard)

// import MyWxLogin from '@/components/yx_dialog/myWXLoginDialog.vue'
import MyDialog from '@/components/yx_dialog/xy-dialog.vue'
Vue.component('MyDialog', MyDialog)

const app = new Vue({
  store,
  ...App,
})
app.$mount()
