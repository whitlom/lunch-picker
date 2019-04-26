import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vuetify'
import firebase from '@/fb'
import './registerServiceWorker'

Vue.config.productionTip = false

let app = '';

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});