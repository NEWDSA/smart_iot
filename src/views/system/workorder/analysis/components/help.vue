<template>
    <div class="md:flex">
      <Card size="default" style="" :loading="loading" title="帮助文档" class="w-full !md:mt-0">
        <template #extra>
            <div class="text-blue-600">
                查看更多
            </div>
        </template>

        <div class="flex flex-wrap">
            <div class="w-1/2 pb-6">产品概述</div>
            <div class="w-1/2 pb-6">使用指南</div>
            <div class="w-1/2 pb-6">接入流程</div>
            <div class="w-1/2 pb-6">接口文档</div>
        </div>

      </Card>
    </div>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { CountTo } from '@/components/CountTo/index'
  // import { Icon } from '@/components/Icon'
  import { Tag, Card } from 'ant-design-vue'
  
  defineProps({
    loading: {
      type: Boolean
    }
  })
  
  
  </script>
  