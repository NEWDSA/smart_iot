import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'
import { t } from '@/hooks/web/useI18n'

const visitor: AppRouteModule = {
    path: '/visitorset',
    name: 'Visitorset',
    component: LAYOUT,
    redirect: '/visitorset/visitorlist',
    meta: {
        icon: 'akar-icons:person-add',
        title: t('routes.visitorset.visitorset')
    },

    children: [
        {
            path: 'visitorclasslist',
            name: 'visitorclasslist',
            component: () => import('@/views/visitorset/visitorclasslist/index.vue'),
            meta: {
                title: t('routes.visitorset.visitorclasslist')
            }
        },
        {
            path: 'visitorlist',
            name: 'visitorlist',
            meta: {
                title: t('routes.visitorset.visitorlist'),
                ignoreKeepAlive: false,
                scrollTop: 0,
            },
            component: () => import('@/views/visitorset/visitorlist/index.vue'),

        },
        // {
        //     path: 'visitor_detail/:id',
        //     name: 'visitordetail',
        //     meta: {
        //         hideMenu: true,
        //         title: t('routes.visitorset.visitor_detail'),
        //         ignoreKeepAlive: true,
        //         showMenu: false,
        //         currentActiveMenu: '/visitorset/visitorlist'
        //     },
        //     component: () => import('@/views/visitorset/visitorlist/detail.vue'),
        // }
    ]
}

export default visitor
