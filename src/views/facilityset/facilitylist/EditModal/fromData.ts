import { FormProps, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '@/components/Icon';

export const formSchema: FormSchema[] = [
    {
        label: '设备名称',
        field: 'DeviceName',
        component: 'Input',
        required: true
    },
    {
        label: '设备类型',
        field: 'TypeId',
        component: 'TreeSelect',
        componentProps: {
            fieldNames: {
                children: 'children', label: 'TypeName', key: 'TypeId', value: 'TypeId'
            },
        },
        required: true
    },
    {
        label: '设备所在区域位置',
        field: 'RegionId',
        component: 'TreeSelect',
        componentProps: {
            placeholder:'请选择区域',
            fieldNames: {
                children: 'child', label: 'RegionName', key: 'RegionId', value: 'RegionId'
            },
        },
        required: true
    },
    {
        label: '说明',
        field: 'Explain',
        component: 'Input',
        required: false
    },
    {
        label: '创建时间',
        field: 'CreatedTime',
        component: 'Input',
        componentProps:{
            disabled:true
        },
        required: true
    },
    {
        label: '设备位置（经纬度）',
        field: 'LongitudeLatitude',
        component: 'Input',
        componentProps:{
            placeholder:"例如：39.908349,116.404412"
        },
        required: true
    },
];