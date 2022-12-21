import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const home: AppRouteModule = {
  path: '/home',
  name: 'Home',
  component: LAYOUT,
  redirect: '/home/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'mdi:home',
    title: t('routes.home.home'),
    orderNo: 9
  },
  children: [
    {
      path: 'index',
      name: 'index',
      component: () => import('/@/views/home/index.vue'),
      meta: {
        title: t('routes.home.home'),
        icon: 'mdi:home',
        hideMenu: true
      }
    }
  ]
}

export default home
