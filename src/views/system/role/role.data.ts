import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { h } from 'vue'
import { Switch } from 'ant-design-vue'
import { setRoleStatus } from '@/api/demo/system'
import { useMessage } from '@/hooks/web/useMessage'
import { usePermission } from '@/hooks/web/useButtonPermission'
import dayjs from 'dayjs'
const { hasPermission } = usePermission()
export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'RoleName',
    width: 200
  },
  {
    title: '排序',
    dataIndex: 'RoleSort',
    width: 50
  },
  {
    title: '状态',
    dataIndex: 'Status',
    width: 120,
    ifShow: hasPermission(['status_Role']),
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false
      }
      return h(Switch, {
        checked: record.Status === '0',
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? '0' : '1'
          const { createMessage } = useMessage()
          setRoleStatus(record.RoleId, newStatus)
            .then(() => {
              record.Status = newStatus
              createMessage.success(`已成功修改角色状态`)
            })
            .catch(() => {
              createMessage.error('修改角色状态失败')
            })
            .finally(() => {
              record.pendingStatus = false
            })
        }
      })
    }
  },
  {
    title: '创建时间',
    dataIndex: 'CreateTime',
    width: 180,
    // 特殊化处理
    format(text, record, index) {
      return dayjs.unix(record.Basic.CreatedAt.seconds).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]
export const formSchema: FormSchema[] = [
  {
    field: 'RoleName',
    label: '角色名称',
    required: true,
    component: 'Input'
  },
  {
    field: 'RoleKey',
    label: '角色值',
    required: true,
    component: 'Input'
  },
  {
    field: 'RoleSort',
    label: '排序',
    component: 'InputNumber',
    required: true
  },
  {
    field: 'Status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' }
      ]
    }
  },
  {
    label: '备注',
    field: 'Remark',
    component: 'InputTextArea'
  },
  {
    label: ' ',
    field: 'menuIds',
    slot: 'menuIds',
    component: 'Input'
  }
]
