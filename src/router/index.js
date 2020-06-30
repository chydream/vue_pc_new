import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/themes/cvue/layout/index'

Vue.use(Router)
// 路由实例
const router = new Router({
  scrollBehavior (to, from, savedPosition) { // 路由滚动行为
    if (savedPosition) {
        return savedPosition
    } else {
        const position = {}
        if (to.hash) {
            position.selector = to.hash
        }
        if (to.matched.some(m => m.meta.scrollToTop)) {
            position.x = 0
            position.y = 0
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(position)
            }, 500)
        })
    }
  },
  routes: [
    {
      path: '/index',
      name: 'Index',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'home',
          name: '首页',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/home/home')
        }
      ]
    },
    {
      path: '/user',
      name: 'User',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: '用户管理',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/user/index.vue')
        },
        {
          path: 'open-list',
          name: '开通列表',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/user/openList.vue')
        },
        {
          path: 'current-strategy',
          name: '当前策略',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/user/currentStrategy.vue')
        }
      ]
    },
    {
      path: '/system',
      name: 'System',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: '用户设置',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/system/index.vue')
        },
        {
          path: 'role-index',
          name: '角色管理',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/system/roleIndex.vue')
        }
      ]
    },
    {
      path: '/chart',
      name: 'Chart',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'line',
          name: '折线图',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/chart/line.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'auth',
          name: '权限配置',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/auth/auth.vue')
        }
      ]
    },
    {
      path: '/tree',
      name: 'Tres',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: '树',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/tree/tree.vue')
        },
        {
          path: 'index1',
          name: '树1',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/tree/tree1.vue')
        },
        {
          path: 'index2',
          name: '树2',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/tree/tree2.vue')
        },
        {
          path: 'index3',
          name: '树3',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/tree/tree3.vue')
        },
        {
          path: 'index4',
          name: '树4',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/tree/tree4.vue')
        }
      ]
    },
    {
      path: '/jsPlumb',
      name: 'jsPlumb',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: '工作流',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/jsPlumb/index.vue')
        }
      ]
    },
    {
      path: '/video',
      name: 'video',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: 'video流',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/video/index')
        },
        {
          path: 'video',
          name: 'videos',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/video/video')
        },
        {
          path: 'videojs',
          name: 'videojs',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/video/videojs')
        },
        {
          path: 'test',
          name: 'test',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/video/test')
        }
      ]
    },
    {
      path: '/video-new',
      name: 'videoNew流',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: 'videoNew',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/videoNew/index')
        }
      ]
    },
    {
      path: '/video-demo',
      name: 'videoDemo',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: 'video_index',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/videoDemo/index')
        }
      ]
    },
    {
      path: '/table-new',
      name: 'videoNew流',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/layout/index'),
      children: [
        {
          path: 'index',
          name: 'videoNew',
          component: () => import(/* webpackChunkName: "group-foo" */'../themes/cvue/views/table/table')
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/login/Login')
    },
    {
      path: '*',
      redirect: '/error/404'
    },
    {
      path: '/error/403',
      name: 'Error403',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/error/403')
    },
    {
      path: '/error/404',
      name: 'Error404',
      component: () => import(/* webpackChunkName: "group-foo" */'../themes/error/404')
    }
  ]
})
export default router
