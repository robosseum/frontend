import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/components/Root'
import Table from '@/components/Table'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Root
    },
    {
      path: '/:tableId',
      name: 'Table',
      component: Table
    }
  ]
})
