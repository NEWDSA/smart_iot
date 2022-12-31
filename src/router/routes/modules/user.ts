import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'
import { t } from '@/hooks/web/useI18n'

const user: AppRouteModule = {
  path: '/user',
  name: 'user',
  component: LAYOUT,
  meta: {
    orderNo: 10,
    icon: 'carbon:user-role',
    title: t('用户管理')
  },
  children: [
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/rolemanger/dept/index.vue'),
      meta: {
        // affix: true,
        title: '部门管理'
      }
    },
    {
      path: 'userPermission',
      name: 'userPermission',
      component: () => import('@/views/rolemanger/account/index.vue'),
      meta: {
        title:'用户管理'
      }
    }
  ]
}

export default user



