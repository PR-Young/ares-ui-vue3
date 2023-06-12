import * as Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import axios from 'axios'
import Tinymce from '@/components/tinymce/index.vue'

createApp(App).component('tinymce', Tinymce)

createApp(App).config.globalProperties.$axios = axios({
  router,
  render: (h) => h(App),
}).$mount('#app')
