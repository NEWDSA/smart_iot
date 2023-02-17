<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" width="500px" @ok="handleSubmit">
    <div>日志内容：{{ logDetail?.Message }}</div>
    <!-- <div>设备名称：{{ device.gatewayId }}</div> -->
    <!-- <div>日志状态：{{ logDetail.Status }}</div> -->
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive } from 'vue';
import { BasicForm, useForm } from '@/components/Form/index';
// import { formSchema } from './role.data';
import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
import { facilityLogInfoApi } from '@/api/facility/facility'

export default defineComponent({
  name: 'RoleDrawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    // const isUpdate = ref(true);
    const logDetail = ref();
    const device = ref({})
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      // setDrawerProps({ confirmLoading: false });
      // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
      // isUpdate.value = !!data?.isUpdate;
      console.log('logDetail', data)
      logDetail.value = data.record
      

      // putDetail(logDetail.value.Id)
    })

    // function putDetail(id){
    //   facilityLogInfoApi({'Id':id}).then(res => {
    //     // console.log(res)
    //     if(res!= ''){
    //     device.value = JSON.parse(res) 
    //     }
    //     console.log('device.value', device.value)
    //   })
    // }

    const getTitle = '日志详情';

    async function handleSubmit() {
      try {
        const values = await validate();
        setDrawerProps({ confirmLoading: true });
        // TODO custom api
        console.log(values);
        closeDrawer();
        emit('success');
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    return {
      registerDrawer,
      getTitle,
      handleSubmit,
      logDetail,
      device,
      // putDetail
    };
  },
});

export const formSchema = [
  {
    field: 'roleName',
    label: '类型',
    required: false,
    component: 'text',
  },
  {
    field: 'roleValue',
    label: '内容',
    required: false,
    component: 'text',
  },
  {
    field: 'status',
    label: '当前状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
  },
  {
    label: '时间',
    field: 'createTime',
    component: 'input'
  }
];
</script>
