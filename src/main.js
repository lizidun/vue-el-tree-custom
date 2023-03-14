import Vue from 'vue'
import Elements from 'element-ui'
import Components from './components'
import App from './App.vue'
import axios from 'axios'
import qs from 'qs'

Vue.use(Elements)
Vue.use(Components)

new Vue({
  el: '#app',
  render: h => h(App)
})
