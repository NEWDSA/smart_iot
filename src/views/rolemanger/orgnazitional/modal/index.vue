<template>
  <BasicModal width="400px" :height="height"  :minHeight="height"   title="创建部门" @ok="handleOk" okText="保存" v-bind="$attrs" @register="register"
    :closeFunc="handleCloseFunc" :maskClosable="false" :keyboard="false" class="upload-modal"
    :okButtonProps="getOkButtonProps" :cancelButtonProps="{ disabled: false }">
    <!-- <div class="pt-3px pr-3px"> -->
      <BasicForm  @register="regiform" :showActionButtonGroup="false" :labelWidth="100" :actionColOptions="{ span: 24 }"
        @submit="getData" />
    <!-- </div> -->
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { BasicModal, useModalInner } from '@/components/Modal';  //内部调用
import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
// import { useMessage } from '@/hooks/web/useMessage';
export default defineComponent({
  props: {
    height: {
      type: Number,
      default: '300'
    }
  },
  components: { BasicForm, BasicModal },
  emits: ['change', 'register', 'delete'],
  setup(props,{emit}) {
    console.log(props,'..props...')
    // const { createMessage } = useMessage();
    const [register, { closeModal }] = useModalInner();  //内部调用
    const schemas: FormSchema[] = [
      {
        field: 'field1',
        component: 'Input',
        label: '部门名称',
        required: true,
        colProps: {
          span: 24,
        },
        defaultValue: '111',
        rules: [{
          required: true,
          // @ts-ignore
          validator: async (rule, value) => {
            if (!value) {
              /* eslint-disable-next-line */
              return Promise.reject('值不能为空');
            }
            if (value === '1') {
              /* eslint-disable-next-line */
              return Promise.reject('值不能为1');
            }
            return Promise.resolve();
          },
          trigger: 'change',
        }],
      },
      {
        field: 'filed2',
        component: 'Input',
        label: '部门说明',
        colProps: {
          span: 24,
        },
      },

    ];
    const [regiform, { getFieldsValue,validateFields }] = useForm({ schemas })
    const getOkButtonProps = computed(() => {
      return {
        disabled: false
      };
    });

    //   点击保存
    function handleOk() {
      // validateForm
      getData(getFieldsValue())
    }
    function getData(value: any) {
      // 调用emit事件
       emit('change',value)
      closeModal()
      // createMessage.success('click search,values:' + JSON.stringify(value));
    }

    // 点击关闭：则所有操作不保存，包括上传的
    async function handleCloseFunc() {
      return true
    }
    // 表单校验
    async function validateForm() {
        try {
          const res = await validateFields();
          console.log('passing', res);
        } catch (error) {
          console.log('not passing', error);
        }
      }
    return {
      register,
      regiform,
      closeModal,
      handleOk,
      getData,
      handleCloseFunc,
      getOkButtonProps,
      validateForm
    };
  },
});
</script>
<style lang="less">
.vben-basic-title {
  justify-content: center;
}

.upload-modal {

  .ant-upload-list {
    display: none;
  }

  .ant-table-wrapper .ant-spin-nested-loading {
    padding: 0;
  }

  &-toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &__btn {
      margin-left: 8px;
      text-align: right;
      flex: 1;
    }
  }
}
</style>
