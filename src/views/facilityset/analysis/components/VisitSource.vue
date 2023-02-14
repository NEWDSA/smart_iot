<template>
  <Card title="快捷入口" :loading="loading">
    <template #extra>
      <div class="text-blue-600" @click="haldkModal()">管理</div>
    </template>

    <div class="flex items-center flex-wrap border-b">
      <div class="w-1/3 text-center pb-5" v-for="(item, index) in shortcutList" :key="index">
        <div>
          <Icon icon="ic:outline-temple-buddhist" size="24"></Icon>
        </div>
        <div class="truncate ...">{{ item.title }}</div>
      </div>
    </div>

    <div>
      <div class="px-2 py-3" style="font-size:16px">最近访问</div>
      <div class="flex items-center flex-wrap">
        <div class="w-1/3 text-center pb-5" v-for="(item, index) in shortcutList" :key="index">
          <div>
            <Icon icon="ic:outline-temple-buddhist" size="24"></Icon>
          </div>
          <div class="truncate ...">{{ item.title }}</div>
        </div>
      </div>
    </div>

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
          <div class="truncate ...">{{ item.title }}</div>
        </div>
      </div>
    </div>

  </Card>

  <RoleDrawer @register="registerDrawer" @success="handleSuccess"></RoleDrawer>
</template>
<script lang="ts" setup>
import Icon from '@/components/Icon';
import { Ref, ref, watch } from 'vue';
import { Card, Tag } from 'ant-design-vue';

import { useDrawer } from '@/components/Drawer';
import RoleDrawer from './modal/SourceDrawer.vue';

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

function handleSuccess(){
  
}

const shortcutList = ref([
  {
    icon: '',
    title: '设备分类',
    path: ''
  },
  {
    icon: '',
    title: '数据看板',
    path: ''
  },
  {
    icon: '',
    title: '区域管理',
    path: ''
  },
  {
    icon: '',
    title: '设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警设备告警',
    path: ''
  },
  {
    icon: '',
    title: '场景配置',
    path: ''
  }
])

</script>
