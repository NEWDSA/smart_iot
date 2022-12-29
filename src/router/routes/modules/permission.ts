import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'
import { t } from '@/hooks/web/useI18n'

const dashboard: AppRouteModule = {
  path: '/permission',
  name: 'Dashboard',
  component: LAYOUT,
  meta: {
    orderNo: 10,
    icon: 'carbon:user-role',
    title: t('routes.dashboard.dashboard')
  },
  children: [
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/permission/menu/index.vue'),
      meta: {
        // affix: true,
        title: '菜单管理'
      }
    },
    {
      path: 'userPermission',
      name: 'userPermission',
      component: () => import('@/views/permission/userPermission/index.vue'),
      meta: {
        title:'用户权限'
      }
    }
  ]
}

export default dashboard



