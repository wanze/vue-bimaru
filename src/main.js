import Vue from 'vue'
import App from './vue/App.vue'
import store from './vue/store'

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
