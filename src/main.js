import Vue from 'vue'
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css'
import VuetifyToast from 'vuetify-toast-snackbar'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'

Vue.use(Vuetify)
const opts = {
  theme: {
    // dark: true
  }
}
let vuetify = new Vuetify(opts)

Vue.use(VuetifyToast, {
	icon: 'mdi-information',
	timeout: 1500,
	showClose: true,
	closeIcon: 'mdi-close',
})
Vue.use(VueClipboard)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify,
}).$mount('#app')
