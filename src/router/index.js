import Vue from 'vue'
import Router from 'vue-router'
import Grid from '@/board/Grid'
import Scores from '@/scores/Scores'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Grid',
      component: Grid
    },
    {
      path: '/scores',
      name: 'Scores',
      component: Scores
    }
  ]
})
