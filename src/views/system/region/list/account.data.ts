import { getTreeList } from '@/api/demo/region'
import { BasicColumn } from '@/components/Table'
import { FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
async function getTree() {
  const { Data } = await getTreeList()

  let treeData: any = []
  // 树形结构进行封装
  // Data.forEach((item) => {
  //   item.forEach((item2) => {
  //     treeData.push({
  //       id: item2.TypeId,
  //       Name:item2.TypeName,
  //       children:[
  //         ...son
  //       ]
  //     })
  //   })
  // })
  // return Data
  // 对数据进行重新组装
  function listTotreeSimple(Data) {
    const res: any = [];
    data.forEach((item)=>{
      
    })
  }
  let datas = listTotreeSimple(data)
}
export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    dataIndex: 'DeviceName',
    width: 120
  },
  {
    title: '设备类型',
    dataIndex: 'DeviceType',
    width: 120
  },
  {
    title: '设备ID',
    dataIndex: 'DeviceId',
    width: 120
  },
  // 需对部门信息进行处理
  {
    title: '设备状态',
    dataIndex: 'DeviceStatus',
    width: 120,
    customRender: ({ record }) => {
      const status = record.DeviceStatus
      const enable = ~~status === 2
      const color = enable ? 'green' : 'red'
      const text = enable ? '正常' : '停用'
      return h(Tag, { color: color }, () => text)
    }
  }
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'UserName',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
    componentProps: () => {
      return {
        placeholder: '请输入用户名',
        onChange: (e: any) => {
          console.log(e)
        }
      }
    }
  }
]

export const accountFormSchema: FormSchema[] = [
  {
    field: 'UserName',
    label: '设备分类',
    component: 'ApiSelect',
    colProps: {
      offset: 1,
      lg: 11,
      md: 11
    },
    // 特殊化处理
    componentProps: {
      api: getVisitorTreeList,
      labelField: 'RoleName',
      valueField: 'RoleId'
    },
    rules: [
      {
        message: '请输入用户名'
      }
    ]
  },
  {
    label: '',
    field: 'RoleId',
    component: 'ApiSelect',
    colProps: {
      offset: 1,
      lg: 11,
      md: 11
    },
    componentProps: {
      api: getAllRoleList,
      labelField: 'RoleName',
      valueField: 'RoleId'
    }
  },
  {
    field: 'DeptId',
    label: '所属部门',
    component: 'TreeSelect',

    componentProps: {
      fieldNames: {
        label: 'Name',
        key: 'Id',
        value: 'Id'
      },
      getPopupContainer: () => document.body
    },
    required: true
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    required: true
  },

  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea'
  }
]
