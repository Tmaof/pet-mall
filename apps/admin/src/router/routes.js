import i18n from '@/i18n'
import Layout from '@/layout'

export const publicRoutes = () => {
  return [
    // 根布局路由页面要存在于公有路由表中
    // 这样做的目的是在那些没有任何私有权限的的用户登录时，也会显示一个布局页面，而不是404。
    {
      path: '/',
      component: Layout
    },
    {
      path: '/info',
      component: Layout,
      redirect: '/info/dashboard',
      meta: {
        title: i18n.$t('router.routes.817884-0'),
        icon: 'my-chart'
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DataAnalysis/Dashboard'),
          meta: {
            title: i18n.$t('router.routes.808363-6')
          }
        },
        {
          path: 'sales',
          name: 'sales',
          component: () => import('@/views/DataAnalysis/Sales'),
          meta: {
            title: i18n.$t('router.routes.808363-7')
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register')
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/404')
    }
  ]
}

export const privateRoutes = () => {
  return [
    {
      path: '/product',
      name: 'product',
      component: Layout,
      redirect: '/product/list',
      meta: {
        title: i18n.$t('router.routes.079395-0'),
        icon: 'my-product'
      },
      children: [
        {
          path: 'category',
          name: 'product-category',
          component: () => import('@/views/Product/Category'),
          meta: {
            title: i18n.$t('router.routes.079395-1'),
            icon: 'my-product-category'
          }
        },
        {
          path: 'tag',
          name: 'product-tag',
          component: () => import('@/views/Product/Tag'),
          meta: {
            title: i18n.$t('router.routes.079395-2'),
            icon: 'my-tag'
          }
        },
        {
          path: 'add',
          name: 'product-add',
          component: () => import('@/views/Product/Add'),
          meta: {
            title: i18n.$t('router.routes.079395-3'),
            icon: 'my-plus'
          }
        },
        {
          path: 'list',
          name: 'product-list',
          component: () => import('@/views/Product/List'),
          meta: {
            title: i18n.$t('router.routes.079395-4'),
            icon: 'my-numbered-list'
          }
        },
        {
          path: 'edit/:id',
          name: 'product-edit',
          component: () => import('@/views/Product/Edit'),
          meta: {
            // 不需要显示在 侧边栏
            // title: '编辑商品',
          }
        }
      ]
    },
    // 订单管理
    {
      path: '/order',
      name: 'order-management',
      component: Layout,
      redirect: '/order/list',
      meta: {
        title: i18n.$t('router.routes.679664-0'),
        icon: 'my-product'
      },
      children: [
        {
          path: 'list',
          name: 'order-list',
          component: () => import('@/views/Order/List'),
          meta: {
            title: i18n.$t('router.routes.679664-1'),
            icon: 'my-numbered-list'
          }
        }
      ]
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: 'client',
          name: 'client-management',
          meta: {
            title: i18n.$t('router.routes.817884-1'),
            icon: 'my-user'
          },
          component: () => import('@/views/Client')
        }
      ]
    },
    // 权限管理
    {
      path: '/acl',
      name: 'acl',
      redirect: '/acl/user',
      component: Layout,
      meta: {
        title: i18n.$t('router.routes.817884-2'),
        icon: 'my-key'
      },
      children: [
        {
          path: 'user',
          name: 'user-list',
          component: () => import('@/views/Acl/User'),
          meta: {
            title: i18n.$t('router.routes.817884-3')
          }
        },
        {
          path: 'role',
          name: 'role-list',
          component: () => import('@/views/Acl/Role'),
          meta: {
            title: i18n.$t('router.routes.817884-4')
          }
        },
        {
          path: 'menu',
          name: 'menu-list',
          component: () => import('@/views/Acl/Menu'),
          meta: {
            title: i18n.$t('router.routes.817884-5')
          }
        }
      ]
    },
    // 日志管理
    {
      path: '/log',
      name: 'log-management',
      component: Layout,
      redirect: '/log/user',
      meta: {
        title: i18n.$t('router.routes.611347-0'),
        icon: 'my-log'
      },
      children: [
        {
          path: 'client',
          name: 'client-log',
          component: () => import('@/views/Log/Client'),
          meta: {
            title: i18n.$t('router.routes.611347-1')
          }
        },
        {
          path: 'user',
          name: 'user-log',
          component: () => import('@/views/Log/User'),
          meta: {
            title: i18n.$t('router.routes.611347-2')
          }
        }
      ]

    }
  ]
}

export default publicRoutes
