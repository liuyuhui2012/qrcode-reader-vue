import Vue from 'vue'
import Router from 'vue-router'
import QRcodeReader from '@/pages/QRcodeReader'
import QRcodeInfo from '@/pages/QRcodeInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'QRcodeReader',
      component: QRcodeReader
    },
    {
      path: '/QRcodeInfo',
      name: 'QRcodeInfo',
      component: QRcodeInfo
    }
  ]
})
