<template>
  <Card title="快捷入口" :loading="loading">
    <template #extra>
      <div v-if="hasPermission(['haldkModal_workorderAnalysis'])" class="text-blue-600" @click="haldkModal()">管理</div>
    </template>

    <div class="flex items-center flex-wrap border-b">
      <div class="w-1/3 text-center pb-5" v-for="(item, index) in shortcutList" :key="index" @click="topage(item.path)">
        <div>
          <Icon :icon="item.Icon" size="24"></Icon>
        </div>
        <div class="truncate ...">{{ item.MenuName }}</div>
      </div>
    </div>

    <!-- <div>
      <div class="px-2 py-3" style="font-size:16px">最近访问</div>
      <div class="flex items-center flex-wrap">
        <div class="w-1/3 text-center pb-5" v-for="(item, index) in shortcutList" :key="index" @click="topage(item.Component)">
          <div>
            <Icon :icon="item.Icon" size="24"></Icon>
          </div>
          <div class="truncate ...">{{ item.MenuName }}</div>
        </div>
      </div>
    </div> -->

    <div>
      <div class="px-2 py-3 flex items-center justify-between">
        <div style="font-size:16px">公告</div>
        <div class="text-blue-600">查看更多</div>
      </div>
      <div class="">
        <div class="flex items-center pb-2" v-for="(item, index) in shortcutList" :key="index">
          <div>
            <Tag class="mb-2" color="blue">
              通知
            </Tag>
          </div>
          <div class="truncate ...">{{ item.MenuName }}</div>
        </div>
      </div>
    </div>

  </Card>

<RoleDrawer @register="registerDrawer" @success="handleSuccess"></RoleDrawer>
</template>
<script lang="ts" setup>

import Icon from '@/components/Icon';
import { Ref, ref, watch,onMounted } from 'vue';
import { Card, Tag } from 'ant-design-vue';
import {usePermission} from '@/hooks/web/useButtonPermission';
import { useDrawer } from '@/components/Drawer';
import RoleDrawer from './modal/SourceDrawer.vue';

import { shortCutMenu } from '@/api/sys/user'

import { useGo } from '@/hooks/web/usePage';
const go = useGo();
const { hasPermission } = usePermission();
const [registerDrawer, { openDrawer }] = useDrawer();

const props = defineProps({
  loading: Boolean,
  width: {
    type: String as PropType<string>,
    default: '100%'
  },
  height: {
    type: String as PropType<string>,
    default: '300px'
  }
})


onMounted(()=>{
  getShortCutMenu()
})

watch(
  () => props.loading,
  () => {
    if (props.loading) {
      return
    }
  },
  { immediate: true }
)


function haldkModal() {
  openDrawer(true, {
    isUpdate: false,
  });
}

function handleSuccess() {
  getShortCutMenu()
}

const shortcutList = ref()


const getShortCutMenu = () => {
  shortcutList.value = []
  shortCutMenu().then(res => {
    res.List.map((item, index) => {
      let path
      if(item.MenuName == '菜单管理' || item.MenuName == '角色管理'){
        let a =item.Component.split('/')
        path =  '/'+a[0]+'/'+a[1]
      }else{
        let a =item.Component.split('/')
        path =  '/'+a[1]+'/'+a[2]
      }
      shortcutList.value.push({
        path:path,
        Icon:item.Icon,
        MenuName:item.MenuName
      })
    })
    console.log(shortcutList.value)
    // shortcutList.value = res.List

  })
}

const topage = (Page) =>{
  console.log(Page)
  go(Page)
}

</script>
