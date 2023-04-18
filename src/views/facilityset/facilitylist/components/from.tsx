import { FormSchema } from '/@/components/Form';
const colProps = {
    span: 8,
};

export const schemas: FormSchema[] = [
    {
        field: 'DeviceId',
        component: 'Input',
        label: '设备ID',
        labelWidth: '20px',
        componentProps: {
            placeholder: '请输入设备ID',
        },
    },
    {
        field: 'DeviceName',
        component: 'Input',
        label: '设备名称',
        labelWidth: '20px',
        componentProps: {
            placeholder: '请输入设备名称',
        },
    },
    {
        field: 'Status',
        label: '设备状态',
        labelWidth: '20px',
        component: 'Select',
        colProps: { span: 3 },
        componentProps: {
            placeholder: '请选择状态',
            options: [
                {
                    label: '在线',
                    value: 1,
                },
                {
                    label: '离线',
                    value: 2,
                },
                {
                    label: '异常',
                    value: 3,
                },
                {
                    label: '故障',
                    value: 4,
                },
                {
                    label: '运行',
                    value: 5,
                },
                // {
                //     label: '未知',
                //     value: 6,
                // },
            ],
            getPopupContainer: () => document.body
        }
    },
    {
        field: 'RegionId',
        label: '设备区域',
        labelWidth: '20px',
        component: 'TreeSelect',
        colProps: { span: 3 },
        componentProps: {
            placeholder: '请选择区域',
            fieldNames: {
                label: 'RegionName',
                key: 'RegionId',
                value: 'RegionId'
            },
            getPopupContainer: () => document.body
        }
    },
];
