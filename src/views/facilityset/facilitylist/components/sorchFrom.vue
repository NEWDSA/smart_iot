<template>
    <BasicForm @register="register" />
</template>
<script lang="ts">
import { BasicForm, useForm  } from '@/components/Form';
import { defineComponent,onMounted } from 'vue';
import { schemas } from './from';
import { getReginList } from '@/api/demo/region'
// import { useMessage } from '/@/hooks/web/useMessage';
// import { PageWrapper } from '/@/components/Page';

export default defineComponent({
    name: 'FormBasicPage',
    components: { BasicForm },
    emits: ['success'],
    setup(_, { emit }) {
        // const { createMessage } = useMessage();
        const [register, { validate, setProps, getFieldsValue,updateSchema }] = useForm({
            labelCol: {
                span: 8,
            },
            wrapperCol: {
                span: 15,
            },
            schemas: schemas,
            actionColOptions: {
                offset: 8,
                span: 23,
            },
            // submitFunc
            submitButtonOptions: {
                text: '查询',
            },
            submitFunc: customSubmitFunc,
            resetFunc: customResmitFunc
        });

        onMounted(async () => {
            // 接入区域列表
            const { Detail } = await getReginList();
            updateSchema({
                field: 'RegionId',
                componentProps: { treeData: Detail },
            })
        })

        async function customResmitFunc() {
            try {
                emit('success');

            } catch (error) { }
        }
        async function customSubmitFunc() {
            try {
                emit('success', getFieldsValue());

            } catch (error) { }
        }



        return { register };
    },
});
</script>
<style lang="less">
.form-wrap {
    padding: 24px;
    background-color: @component-background;
}

.ant-row .ant-col-23 {
    // display: flex;
    margin-left: 10px !important;
    flex: none !important;
}

.ant-form-item-label{
    text-align: left;
    padding-left:10px ;
}

.ant-form-item-control-input-content {
    display: flex;
    width: 100%;
}
.ant-form-item-control-input-content >div {
    // display: flex;
    width: 100%;
}
</style>
  