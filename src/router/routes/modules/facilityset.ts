import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'
import { t } from '@/hooks/web/useI18n'

const facility: AppRouteModule = {
    path: '/facilityset',
    name: 'Facilityset',
    component: LAYOUT,
    redirect: '/facilityset/facilitylist',
    meta: {
        icon: 'ion:settings-outline',
        title: t('routes.facilityset.facilityset')
    },

    children: [
        {
            path: 'facilityclassify',
            name: 'Facilityclassify',
            component: () => import('@/views/facilityset/facilityclassify/index.vue'),
            meta: {
                title: t('routes.facilityset.facilityclassify')
            }
        },
        {
            path: 'facilitylist',
            name: 'Facilitylist',
            meta: {
                title: t('routes.facilityset.facilitylist'),
                ignoreKeepAlive: false,
                scrollTop: 0,
            },
            component: () => import('@/views/facilityset/facilitylist/index.vue'),

        },
        {
            path: 'facility_detail/:id',
            name: 'Facilitydetail',
            meta: {
                hideMenu: true,
                title: t('routes.facilityset.facility_detail'),
                ignoreKeepAlive: true,
                showMenu: false,
                currentActiveMenu: '/facilityset/facilitylist'
            },
            component: () => import('@/views/facilityset/facilitylist/detail.vue'),
        }
    ]
}

export default facility
