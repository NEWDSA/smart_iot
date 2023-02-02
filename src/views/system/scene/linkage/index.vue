<template>
  <PageWrapper title="场景联动详情" contentBackground>
    <template #extra>
      <a-button type="primary"> 保存设置 </a-button>
    </template>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y">
        <span class="flex">
          <Icon icon="carbon:3d-cursor" color="#888888" size="30" />
          <span class="text-lg ml-4">场景名称</span>
        </span>
        <a-input placeholder="会议室温控场景应用" />
        <span class="flex">
          <Icon icon="carbon:3d-cursor" color="#888888" size="30" />
          <span class="text-lg ml-4">触发方式</span>
        </span>
        <!-- 卡片 -->
        <ProjectCard :loading="loading" class="enter-y" />
        <BasicForm @register="register" @submit="handleSubmit">
          <template #add="{ field }">
            <Button v-if="Number(field) === 0" @click="add">+</Button>
            <Button v-if="field > 0" @click="del(field)">-</Button>
          </template>
        </BasicForm>
      </div>
      <div class="lg:w-3/10 w-full enter-y">
        <div class="scroll-wrap">
          <h1>配置说明</h1>
          <ScrollContainer class="mt-4">
            <ul class="p-3">
              <template v-for="index in 100" :key="index">
                <li class="p-2" :style="{ border: '1px solid #eee' }">
                  {{ index }}
                </li>
              </template>
            </ul>
          </ScrollContainer>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Description } from '@/components/Description/index';
import ProjectCard from './components/ProjectCard.vue';
import { Icon } from '@/components/Icon';
import { ScrollContainer } from '@/components/Container/index';
import { BasicTable, useTable } from '@/components/Table';
import { PageWrapper } from '@/components/Page';
import { Divider } from 'ant-design-vue';
import { BasicForm, useForm } from '@/components/Form/index';
import {
  refundSchema,
  refundData,
  personSchema,
  personData,
  refundTableSchema,
  refundTimeTableSchema,
  refundTableData,
  refundTimeTableData,
} from './data';
export default defineComponent({
  components: { Description, BasicTable, PageWrapper, [Divider.name]: Divider, ScrollContainer, Icon, ProjectCard, BasicForm, useForm },
  setup() {
    const top = ref<number>(10);
    const loading = ref(true);
    const [registerRefundTable] = useTable({
      title: '退货商品',
      dataSource: refundTableData,
      columns: refundTableSchema,
      pagination: false,
      showIndexColumn: false,
      scroll: { y: 300 },
      showSummary: true,
      summaryFunc: handleSummary,
    });

    const [registerTimeTable] = useTable({
      title: '退货进度',
      columns: refundTimeTableSchema,
      pagination: false,
      dataSource: refundTimeTableData,
      showIndexColumn: false,
      scroll: { y: 300 },
    });
    const [register, { appendSchemaByField, removeSchemaByField, validate }] = useForm({
      schemas: [
        {
          field: 'field0a',
          component: 'Input',
          label: '字段0',
          colProps: {
            span: 8,
          },
          required: true,
        },
        {
          field: 'field0b',
          component: 'Input',
          label: '字段0',
          colProps: {
            span: 8,
          },
          required: true,
        },
        {
          field: '0',
          component: 'Input',
          label: ' ',
          colProps: {
            span: 8,
          },
          slot: 'add',
        },
      ],
      labelWidth: 100,
      actionColOptions: { span: 24 },
    });
    function dd(value) {
      console.log(value, '?...value...?')
    }
    function handleSummary(tableData: any[]) {
      let totalT5 = 0;
      let totalT6 = 0;
      tableData.forEach((item) => {
        totalT5 += item.t5;
        totalT6 += item.t6;
      });
      return [
        {
          t1: '总计',
          t5: totalT5,
          t6: totalT6,
        },
      ];
    }
    const n = ref(1);
    function add() {
      appendSchemaByField(
        {
          field: `field${n.value}a`,
          component: 'Input',
          label: '字段' + n.value,
          colProps: {
            span: 8,
          },
          required: true,
        },
        '',
      );
      appendSchemaByField(
        {
          field: `field${n.value}b`,
          component: 'Input',
          label: '字段' + n.value,
          colProps: {
            span: 8,
          },
          required: true,
        },
        '',
      );

      appendSchemaByField(
        {
          field: `${n.value}`,
          component: 'Input',
          label: ' ',
          colProps: {
            span: 8,
          },
          slot: 'add',
        },
        '',
      );
      n.value++;
    }
    async function handleSubmit(){
      try{
        const data=await validate();
        console.log(data,'>...data...?')
      } catch(e){
        console.log(e);
      }
    }
    function del(field) {
      removeSchemaByField([`field${field}a`, `field${field}b`, `${field}`]);
      n.value--;
    }
    setTimeout(() => {
      loading.value = false;
    }, 1500);
    return {
      registerRefundTable,
      registerTimeTable,
      register,
      handleSubmit,
      dd,
      add,
      del,
      loading,
      refundSchema,
      top,
      refundData,
      personSchema,
      personData,
    };
  },
});
</script>
<style lang="less" scoped>
.desc-wrap {
  padding: 16px;
  background-color: @component-background;
}

.scroll-wrap {
  // width: 50%;
  height: 300px;
  background-color: @component-background;
}
</style>
