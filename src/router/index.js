import Vue from 'vue'
import Router from 'vue-router'
import Board from '@/utils/Board'
import Grid from '@/board/Grid'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Grid',
      component: Grid
    }
  ]
})
