<template>
  <div>
    <div class="px-5">
      <div class="flex justify-between items-center">
        <div class="text-lg">工单信息详情</div>
        <Icon icon="heroicons:pencil-square-solid" :size="24" @click="editStatusFun"
          v-if="editStatus == false && mySelf == 2 && workObj[3].value == 1 && hasPermission(['workorder_detail_Edit_Info_Btn'])" />
      </div>

      <div class="centents">
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[0].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[0].value }}</div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[1].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ dayjs.unix(workObj[1].value).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[2].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[2].value }}</div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[3].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[3].value == 1 ? '受理中' : '已完结' }}</div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[4].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[4].value }}</div>
        </div>

        <div class="flex items-center my-4" v-if="editStatus == false">
          <div class="w-4/10 text-gray-400">{{ workObj[5].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[5].value }}</div>
        </div>
        <div class="flex items-center my-4" v-if="editStatus == true">
          <div class="w-4/10 text-gray-400">{{ workObj[5].lable }}</div>
          <div class="w-6/10 text-gray-400">
            <Select :value="EPriorityW" class="w-50" @change="searchSlectCut">
              <div :value="item.label" v-for="(item, index2) in options" :key="item.value">
                {{ item.label }}
              </div>
            </Select>
          </div>
        </div>

        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[6].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[6].valueW }}</div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[7].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[7].valueW }}</div>
        </div>

        <div class="flex items-center my-4" v-if="editStatus == false">
          <div class="w-4/10 text-gray-400">{{ workObj[8].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[8].valueW }}</div>
        </div>
        <div class="flex items-center my-4" v-if="editStatus == true">
          <div class="w-4/10 text-gray-400">{{ workObj[8].lable }}</div>
          <div class="w-6/10 text-gray-400 flex ">
            <Select v-model:value="SGRvalueW" mode="tags" style="width: 80%" :token-separators="[',']"
              placeholder="请选择工单关注人" disabled></Select>
            <div class="pl-4" style="width:20%">
              <Button @click="showGRen()">
                <Icon icon="ic:outline-plus"></Icon>
              </Button>
            </div>
          </div>
        </div>

        <!-- <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[9].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[9].value }}</div> 
        </div> -->
        <!-- <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[10].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[10].value }}</div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[11].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[11].value }}</div>
        </div> -->
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[12].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ workObj[12].value }}</div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-4/10 text-gray-400">{{ workObj[13].lable }}</div>
          <div class="w-6/10 text-gray-400 truncate ...">{{ dayjs.unix(workObj[13].value).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>

        <div class="flex items-center my-4" v-if="editStatus == true">
          <a-button type="primary" size="small" class="ml-4" @click="hadlkOkInput">
            保 存
          </a-button>
          <a-button type="primary" size="small" class="ml-4" @click="hadlkCancelInput" ghost>
            取 消
          </a-button>
        </div>

      </div>
    </div>
  </div>


  <!-- 用户列表 -->
  <userDrawer @register="registerMyTable" @success="bulkPermission" />
</template>

<script setup>
import Icon from '@/components/Icon';
import { ref, onMounted, reactive, watch } from 'vue';
import { TaskTicketInfoApi, TaskTicketEditApi } from '@/api/sys/workorder'
import { message, Select, Button } from 'ant-design-vue';
import { useModal } from '@/components/Modal';
import userDrawer from '@/views/facilityset/facilitylist/components/userDrawer.vue'
import dayjs from 'dayjs'
import { usePermission } from '@/hooks/web/useButtonPermission';
const { hasPermission } = usePermission();
const [registerMyTable, { openModal }] = useModal();

const props = defineProps({
  // 工单ID
  DeviceId: { type: Number || String, default: 1000025128043 },
  workOrderId: { type: Number || String, default: null },
  workTitle: { type: String, default: null },
  workContent: { type: String, default: null },
  mySelf: { type: Number || String, default: 1 }
})

// const workTitle = ref('')
// const workContent = ref('')
const workObj = ref([
  {
    lable: '工单号',
    value: '',
  },
  {
    lable: '创建时间',
    value: '',
  },
  {
    lable: '发起人',
    value: '',
  },
  {
    lable: '状态',
    value: '',
  },
  {
    lable: '工单模板',
    value: '',
  },
  {
    lable: '优先级',
    value: '',
  },
  {
    lable: '受理组',
    value: '',
    valueW: '',
  },
  {
    lable: '受理人',
    value: '',
    valueW: '',
  },
  {
    lable: '关注人',
    value: '',
    valueW: '',
  },
  {
    lable: '工单分类',
    value: '',
  },
  {
    lable: '关联客户',
    value: '',
  },
  {
    lable: '客户联系方式',
    value: '',
  },
  {
    lable: '已用时间',
    value: '',
  },
  {
    lable: '最新更新时间',
    value: '',
  }
])

const options = [
  { label: '低', value: 1 },
  { label: '一般', value: 2 },
  { label: '紧急', value: 3 },
  { label: '非常紧急', value: 4 }
]

const SGRvalue = ref()
const SGRvalueW = ref()
const showGRen = () => {
  // SGRvalue.value = workObj[8].value
  // SGRvalueW.value = workObj[8].valueW

  openModal(true, {
    data: SGRvalue.value
  });
}

const editStatus = ref(false)
const EWorkorderDetailContent = ref('')
// onMounted(() => {
//   getTaskTicketInfo()
// })

watch(() => props.workOrderId, () => {
  console.log(props.workOrderId, 'props.workOrderId')
  if (props.workOrderId != null) {
    getTaskTicketInfo()
  }
  // props.workOrderId != null ?  : ''
})

const getTaskTicketInfo = (idd) => {
  console.log('work')
  TaskTicketInfoApi({ 'Id': idd ? idd : props.workOrderId }).then(res => {
    // if(res[0]?.Status == 2){
    //   editStatus.value = false
    // }
    workObj.value[0].value = res[0]?.Id
    workObj.value[1].value = res[0]?.Basic?.CreatedAt.seconds
    workObj.value[2].value = res[0]?.CreatorName
    workObj.value[3].value = res[0]?.Status
    workObj.value[4].value = '默认模板' //res[0]?.TemplateName
    workObj.value[5].value = res[0]?.Priority == 1 ? '低' : res[0]?.Priority == 2 ? '一般' : res[0]?.Priority == 3 ? '紧急' : '非常紧急'
    workObj.value[6].valueW = res[0]?.AcceptanceGroupNames
    workObj.value[6].value = res[0]?.AcceptanceGroup
    workObj.value[7].valueW = res[0]?.AcceptorNames
    workObj.value[7].value = res[0]?.Acceptor
    workObj.value[8].valueW = res[0]?.FollowersNames
    workObj.value[8].value = res[0]?.Followers
    workObj.value[9].value = res[0]?.NoticeType
    workObj.value[10].value = null
    workObj.value[11].value = null
    workObj.value[12].value = res[0]?.usedTime
    workObj.value[13].value = res[0]?.Basic?.UpdatedAt.seconds


    // workTitle.value = res[0]?.Title
    // workContent.value = res[0]?.Content
  })
}

function editStatusFun() {
  EPriority.value = workObj?.value[5].value == '低' ? 1 : workObj.value[5].value == '一般' ? 2 : workObj.value[5].value == '紧急' ? 3 : 4
  EPriorityW.value = workObj?.value[5].value

  if (workObj.value[8]?.value && workObj.value[8]?.valueW) {
    SGRvalue.value = workObj.value[8]?.value
    SGRvalueW.value = workObj.value[8]?.valueW.split(',')
  } else {
    SGRvalue.value = []
    SGRvalueW.value = []
  }



  // EWorkorderDetailContent.value = WorkorderDetail.value.Content
  editStatus.value = !editStatus.value

}

const EPriority = ref('')
const EPriorityW = ref('')
const searchSlectCut = (e, data) => {
  EPriority.value = data.key
  EPriorityW.value = e
  console.log(EPriority, EPriorityW)
}

function bulkPermission(data, value, dataW) {
  SGRvalue.value = data
  SGRvalueW.value = dataW
  // console.log(data,value,dataW)
}

function hadlkOkInput() {
  // if (SGRvalue.value == '') {
  //   message.warn('请选择关注人')
  //   return;
  // }
  var obj = {
    Detail: {
      Id: Number(props.workOrderId),
      Priority: EPriority.value,
      Followers: SGRvalue.value,
      Title: props.workTitle,
      Content: props.workContent,
    }
  }

  TaskTicketEditApi(obj).then(res => {
    EPriorityW.value = ''
    SGRvalue.value = ''
    SGRvalueW.value = ''

    editStatus.value = false
    getTaskTicketInfo(Number(props.WorkorderId))
  })
}

function hadlkCancelInput() {
  EPriorityW.value = ''
  SGRvalue.value = ''
  SGRvalueW.value = ''

  editStatus.value = false
}


defineExpose({
  getTaskTicketInfo
})
</script>

<style lang="less"></style>