<template>
  <PageWrapper contentFullHeight title="设备列表">
    
  <div>
    <div class="p-2 bg-white">

      <div class="my-4 md:flex items-center">
        <div class="flex">
          <div class="px-3 py-1 mr-2" v-for="(item, index) in facilityTab" :key="item.id"
            :class="facilityTabIndex == index ? 'bg-gray-100 sp-blue-text rounded-2xl' : ''"
            @click="cutTab(item.TypeId, index)">
            {{ item.TypeName }}
          </div>
        </div>
        <div class="search md:ml-10 mt-3 md:mt-0 flex">
          <Select :value="searchSlect.selectValue" class="w-50" @change="searchSlectCut">
            <div :value="item.lable" v-for="(item, index2) in searchSlect.select" :key="item.value">
              {{ item.lable }}
            </div>
          </Select>
          <a-input-search v-model:value="searchValue" placeholder="搜索" class="w-full md:w-50 pl-3" @search="onSearch" />
        </div>
      </div>


      <div class="facility-list">
        <div class="mb-5"
          v-for="(item, index) in facilityTabIndex == '0' && !SearchStatus ? facilityList : SelectFacilityList ">
          <div class="flex items-center mb-5" v-if="!SearchStatus">
            <!--v-if="!SearchStatus && item.facility.length > 0" -->
            <div class="text-df font-bold mr-5">{{ item.facilityTab.TypeName }}</div>

            <div>
              <div class="fasility-class-select" v-if="item.facilityTab.children">
                <!-- //v-for="(Sonvalue, index) in item.facilitySonTab" -->
                <TreeSelect :defaultValue="faTypeName[facilityTabIndex == '0' ? index : 0]"
                  v-if="facilityTabIndex == '0' ? facilityTab[index + 1].children : facilityTab[facilityTabIndex].children"
                  v-model:value="faTypeName[facilityTabIndex == '0' ? index : faTypeName?.length - 1]"
                  :tree-data="facilityTabIndex == '0' ? facilityTab[index + 1].children : facilityTab[facilityTabIndex].children"
                  @change="SelectCut($event, index, item.facilityTab.TypeId)" :field-names="filedName"
                  style="width: 200px;" tree-default-expand-all>
                </TreeSelect>

              </div>

            </div>

          </div>
          <div class="flex items-center flex-wrap" v-if="item.facility?.length > 0">

            <div v-for="(facility, index2) in item.facility" :key="facility.DeviceId" class="w-100 mb-5"
              @click="pathDetail(facility.DeviceId)">

              <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5">
                <div class="flex items-center justify-between">
                  <div class="font-bold">{{ facility.DeviceName }}</div>
                  <div class="rounded-md px-2 flex items-center" :class="computedStatus(facility.NetworkStatus, true)">
                    <div class="w-1 h-1 mr-2" :class="computedStatus(facility.NetworkStatus, false)"
                      style="border-radius: 50%;"></div>
                    {{
                      facility.NetworkStatus == 1 ? '启用' : facility.NetworkStatus == 2 ? '禁用' : facility.NetworkStatus
                        == 3 ? '异常' : facility.NetworkStatus == 4 ? '故障' : facility.NetworkStatus == 5 ? '运行' : '离线'
                    }}
                  </div>
                </div>
                <div class="text-gray-500 mb-5">ID:{{ facility.DeviceId }}</div>
                <div class="text-gray-500">设备类型 <span class="text-black">{{
                  checkcheckTypeTree(facility.TypeId)
                }}</span></div>
                <div class="text-gray-500">设备区域 <span class="text-black">{{
                  checkcheckRegionTree(facility.RegionId)
                }}</span></div>

                <div class="bottom-but flex items-center mt-2 justify-end">
                  <Modal v-model:visible="ModalShow[facilityTabIndex == '0' && !SearchStatus ? index : 0].model[index2]"
                    @ok="handleOk(index, index2)" @cancel="handleClock(index, index2)" title="移出设备">
                    <div class="p-3">确认移出 {{ ModalDeviceName }} 此设备？</div>
                  </Modal>
                  <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click.stop="showModalClick(index, index2)"
                    v-if="facility.TypeId != -1">移出</div>
                  <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click.stop="handleEdit(index, index2)">编辑</div>
                  <div class="sp-blue-bg text-white py-2 px-4 mr-3 rounded"
                    v-if="facility.NetworkStatus == 2 || !facility.NetworkStatus"
                    @click.stop="enableDevice(facility.DeviceId, index, index2)">启用</div>
                  <div class="bg-red-600 text-white py-2 px-4 mr-3 rounded"
                    v-if="facility.NetworkStatus == 1 || facility.NetworkStatus == 5"
                    @click.stop="disableDevice(facility.DeviceId, index, index2)">禁用</div>
                  <div class="bg-gray-300 text-white py-2 px-4 mr-3 rounded"
                    v-if="facility.NetworkStatus == 3 || facility.NetworkStatus == 4">启用</div>
                </div>
              </div>
            </div>
            <div class="w-100 mb-5"
              v-if="facilityTabIndex == '0' && !SearchStatus ? facilityListLock[index] == false : SelectFacilityLock == false">
              <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5"
                @click="addpage(index, facilityTabIndex)" style="height:195px;">
                更多+
              </div>
            </div>
          </div>

          <div v-else class="w-100 mb-5">
            <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5"
              @click="addpage(index, facilityTabIndex)" style="height:195px;">
              暂无设备
            </div>

          </div>

          <!-- <div v-else-if="facilityTabIndex!='0' && SelectFacilityList[0].facility.length < 1 &&!SearchStatus" class="w-100 mb-5">
            暂无设备
          </div>

          <div v-if="SearchStatus ? SelectFacilityList[0].facility.length < 1 || SearchStatus && SelectFacilityList[0].facility.length < 1 : ''" class="w-100 mb-5">
            暂无设备
          </div> -->

        </div>
      </div>

    </div>

    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip"
      :background="compState.background" />

    <EditModel @register="registerModal" @success="handleSuccess"></EditModel>

    <Modal v-model:visible="sceneStopModal" title="系统提示" :footer="null">
      <div class="p-5">
        <div class="text-base">当前设备包含关联场景，是否停用关联场景？</div>
        <div class="flex mt-3" style="justify-content: end;">
          <div class="bg-blue-600 text-white rounded px-4 py-1 mr-2" @click="stopClick">停用</div>
          <div class="text-blue-600 rounded px-4 py-1 mr-2" style="border:1px solid rgba(37, 99, 234)"
            @click="stopCheck">查看</div>
          <div class="text-blue-600 rounded px-4 py-1" style="border:1px solid rgba(37, 99, 235,1)" @click="stopClock">
            取消</div>
        </div>
      </div>

    </Modal>
  </div>
</PageWrapper>
</template>
<script lang="ts" >
import { ref, reactive, defineComponent } from 'vue';
import { Select, Modal, TreeSelect } from 'ant-design-vue';
import { useGo } from '@/hooks/web/usePage';
import { facilityListApi, facilityTypeTreeApi, facilityEnableApi, facilityDisableApi, facilityCheckRuleApi, facilityRegionListApi, facilityDisableRuleApi,facilityRelieveApi } from '@/api/facility/facility'
import { connect, registerTopAreaRef, registerCurrentAreaRef, registerDevicesRef } from '@/utils/iot'
import { message } from 'ant-design-vue';
import { Loading } from '@/components/Loading';
import { useModal } from '@/components/Modal';
import EditModel from './EditModal/index.vue'
import { PageWrapper } from '@/components/Page';

export default defineComponent({
  name: 'Facilitylist',
  components: { Select, Modal, TreeSelect, Loading, EditModel,PageWrapper },
  setup() {
    const go = useGo();
    const [registerModal, { openModal }] = useModal();
    const searchValue = ref('');
    const searchSlect = ref({
      select: [
        { lable: '设备名称', value: '1' },
        { lable: '设备Id', value: '2' }
      ],
      selectId: '1',
      selectValue: '设备名称'
    })
    const facilityTabIndex = ref('0');
    const faTypeName: any = ref([])
    const facilityListObj: any = reactive([]);
    const facilityListLock: any = reactive([]);
    const SelectFacilityList: any = reactive([]);
    const SelectFacilityListObj = reactive({
      TypeId: '',
      PageSize: 7,
      PageNum: 1,
      DeviceName: ''
    });
    const SelectFacilityLock = ref(false)

    const SearchStatus = ref(false)  //搜索

    // 移出弹窗
    const ModalShow: any = ref([])
    const ModalDeviceName = ref()
    // const showFacilityTab = ref()

    const facilityTab: any = reactive([
      {
        TypeId: 0,
        TypeName: '全部'
      },
    ]);

    // loading
    const compState = reactive({
      absolute: false,
      loading: false,
      tip: '加载中...',
      background: 'rgba(0,0,0,.5)'
    });

    // 禁用启用
    const sceneStopModal = ref(false)
    const sceneStopId = ref()

    // 编辑
    function handleEdit(index, index2) {
      if (SearchStatus.value || facilityTabIndex.value != '0') {
        var record = SelectFacilityList[index].facility[index2]
      } else {
        var record = facilityList[index].facility[index2]
      }

      if (record.NetworkStatus == 2) {
        message.warn('设备处于禁用状态，无法更新')
        return
      }
      if (record.Longitude && record.Latitude) {
        record.LongitudeLatitude = record.Latitude + ',' + record.Longitude
      }
      record.CreatedTime = checkTime(record.Basic.CreatedAt.seconds)
      // console.log(record)
      openModal(true, {
        isUpdate: true,
        record,
        index
      });
    }
    // 编辑成功
    function handleSuccess() {
      message.success('操作成功')

      if (SearchStatus.value == true) {
        SelectGetfacilityList(true)
      }

      if (facilityTabIndex.value == '0') {
        resetObj(null, 'all')
        // console.log(index)
        // console.log('facilityListObj',facilityListObj[index])
        setTimeout(() => {
          text();
        }, 300);

      } else {
        resetObj(null, 'sou')
        // SelectFacilityListObj.TypeId = fuId
        SelectFacilityListObj.PageSize = 7
        SelectFacilityListObj.PageNum = 1
        // console.log('SelectFacilityListObj',SelectFacilityListObj)
        SelectGetfacilityList(true)
      }

    }


    //切换分类 
    function cutTab(TypeId, index) {
      SelectFacilityList.length = 0
      SelectFacilityListObj.PageNum = 1
      // facilityListObj[index].PageNum = 1

      facilityTabIndex.value = index

      if (index == 0) {
        ModalShow.value = []
        // console.log(facilityList)
        for (let o = 0; o < facilityList.length; o++) { //添加设备
          ModalShow.value.push({
            model: []
          })
          // facilityList[y].facility.push(valt)
          ModalShow.value[o].model.push(false) //弹窗
          // console.log('facilityList', res)
        }
      }

      if (SearchStatus.value = true) {
        SearchStatus.value = false
        SelectFacilityListObj.DeviceName = ''
      }

      //   for (let o = 0; o < faTypeName.value.length; o++) {

      faTypeName.value[faTypeName.value.length - 1] = '全部' //重置分类列表页的子分类select
      //   }
      console.log(faTypeName)

      if (index != 0) {
        for (let i = 0; i < facilityTab.length; i++) {
          console.log(TypeId, facilityTab[i].TypeId)

          if (TypeId == facilityTab[i].TypeId) {
            SelectFacilityListObj.TypeId = TypeId
            SelectFacilityList.push({            //push设备类别下的小tab栏，初始化
              facilityTab: facilityTab[i],
              facility: []
            })
            // 其余分类的设备获取
            SelectGetfacilityList(true)
            return;
          }
        }
      }

    }

    // 各自类型添加 (tab菜单全部旁边的一级分类)
    function SelectGetfacilityList(type) {
      // 请求当前设备类别的接口
      if (type) { //一样的 不传就push（类似第二页）
        console.log('SelectFacilityList', SelectFacilityList)
        SelectFacilityList[0].facility = []
      }

      ModalShow.value = []

      ModalShow.value.push({
        model: []
      })
      console.log()

      if (!SearchStatus.value) {
        SelectFacilityList.DeviceName = ''
      }

      facilityListApi(SelectFacilityListObj).then(res => {
        if (!res.List) {
          return;
        }

        for (let o = 0, valt; valt = res.List[o++];) {
          SelectFacilityList[0].facility.push(valt)
          ModalShow.value[0].model.push(false) //弹窗
        }

        // 计算分页
        console.log(SelectFacilityList[0])
        // console.log('console.log(res.Total / (res.PageSize * res.PageNum))',res.Total / (res.PageSize * res.PageNum))
        if (res.Total / (res.PageSize * res.PageNum) <= 1) {

          SelectFacilityLock.value = true
        } else {
          SelectFacilityLock.value = false
        }
      })
    }

    const facilityList: any = reactive([
      // {
      //   facilityTab: '网关设备',    //tab栏
      //   facilityClass: [
      //     {
      //       label: '全部'
      //     },
      //     {
      //       label: '分类1'
      //     }
      //   ],
      //   facilityClassIndex: '全部',
      //   facility: [                 // 设备
      //     {
      //       id: '246531543123265',
      //       name: '网关',
      //       type: '网关设备',
      //       tyName: '网关ASSAD',
      //       status: 1
      //     },
      //   ]
      // }
    ])

    // 分页
    function addpage(index, type) {
      if (type == 0 && !SearchStatus.value) {
        facilityListObj[index].PageNum += 1
        getfacilityList(index, null, null)
      } else {
        SelectFacilityListObj.PageNum += 1
        SelectGetfacilityList(null)
      }

    }

    // 初始化
    getTypeList()
    function getTypeList() {
      openLoading(false);
      facilityTypeTreeApi().then(res => {
        console.log('res', res)
        for (let i = 0; i < res.length; i++) {

          // 加在select菜单的默认值
          faTypeName.value.push('全部')

          facilityList.push({            //push设备类别下的小tab栏，初始化
            facilityTab: {},
            facility: []
          })
          ModalShow.value.push({
            model: []
          })
          // console.log(ModalShow.value)
          facilityListObj.push({         //push根据设备类别 查询设备的条件
            PageNum: 1,
            PageSize: 7,
            TypeId: res[i].SelfData.TypeId
          })

          facilityListLock.push(false) //分页锁

          facilityList[i].facilityTab = res[i].SelfData //顶级分类

          // 暂存 
          facilityTab.push(res[i].SelfData) //push设备类别的tab栏

          if (res[i].SonData) {
            facilityList[i].facilityTab.children = [{ //添加一个全部的选项 //用了tree()之后这个没什么用 相当与 facilityList[i].facilityTab.children = []
              TypeId: '0',
              TypeName: "全部"
            }]

            // for (let y = 0; y < res[i].SonData.length; y++) {    //封装成自己的数据 打印就知道了
            //   debugger;
            // console.log('facilityList[i].facilityTab.children',facilityList[i].facilityTab.children)
            //   facilityList[i].facilityTab.children.push(res[i].SonData[y].SelfData)

            //   if (res[i].SonData[y].SonData) {
            //     // console.log(res[i].SonData[y].SonData)
            //     facilityList[i].facilityTab.children[y + 1].children = []
            //     // console.log('res[i].SonData',facilityList[i].facilityTab)
            //     for (let x = 0; x < res[i].SonData[y].SonData.length; x++) {
            //       facilityList[i].facilityTab.children[y + 1].children.push(res[i].SonData[y].SonData[x].SelfData)

            //     }
            //   }
            // }
            // facilityList[i].facilityTab.children = []

            facilityList[i].facilityTab.children.push(tree([res[i]])[0])

            facilityList[i].facilityTab.children.unshift({ //添加一个全部的选项  //用了tree()之后看这个 第一个添加全部
              TypeId: '0',
              TypeName: "全部"
            })

          }

        }

        // 固定添加
        ModalShow.value.push({
          model: []
        })
        facilityListObj.push({         //push根据设备类别 查询设备的条件
          PageNum: 1,
          PageSize: 7,
          TypeId: -1
        })
        facilityTab.push(
          {
            TypeId: -1,
            TypeName: '待分类设备'
          },
        )
        facilityList.push({            //push设备类别下的小tab栏，初始化
          facilityTab: { TypeId: -1, TypeName: "待分类设备" },
          facility: []
        })
        // 固定添加结束
      })
      console.log('facilityList', facilityTab)

      faTypeName.value.push('全部') //搜索用的
      console.log(faTypeName, 'faTypeName5+656+')
      setTimeout(() => {   //延时查询
        // 出现的
        text();
      }, 1000);
    }


    // 循环添加 设备类别->设备
    function getfacilityList(y, type, id) {

      // console.log('facilityListObj',facilityListObj)
      // console.log(facilityListObj)
      // console.log('y', y)
      new Promise(() => {
        //自定义请求参数
        console.log('facilityListObj[y].TypeId', facilityListObj[y].TypeId, y)
        let obj = {
          'TypeId': facilityListObj[y].TypeId,
          'PageSize': facilityListObj[y].PageSize,
          'PageNum': facilityListObj[y].PageNum
        }

        if (id) { //如果传来ID
          obj.TypeId = id
        }
        if (type) { //重新查询 不传的话就不清空直接push（查第二页？类似）
          facilityList[y].facility = []
        }
        // 请求当前设备类别的接口
        facilityListApi(obj).then(res => {
          // debugger
          console.log('obj', obj)
          console.log(res, 'dddd')

          if (!res.List) { //如果没数据
            return;
          }
          // debugger;
          for (let o = 0, valt; valt = res.List[o++];) { //添加设备
            facilityList[y].facility.push(valt)
            ModalShow.value[y].model.push(false) //弹窗
            console.log('facilityList', res)
            // debugger;
          }

          // 计算分页
          if (res.Total / (res.PageSize * res.PageNum) <= 1) {
            facilityListLock[y] = true  //不分页
          } else {
            facilityListLock[y] = false //分页
          }
          // console.log(facilityListLock)
          // console.log('123', res.Total / (res.PageSize * res.PageNum))
        })

      })

    }

    // 循环设备类别 执行完一次再执行下一次
    async function text() {
      console.log('facilityTab', facilityList)
      // console.log('showFacilityTab',showFacilityTab)

      for (let y = 0; y < facilityListObj.length; y++) {
        try {
          await getfacilityList(y, true)
        } catch (err) {
          // TODO
        }
      }
    }

    // 搜索框
    function onSearch() {
      if (searchValue.value == '') {
        message.warn('请输入内容')
        return;
      }
      SearchStatus.value = true

      SelectFacilityListObj.PageSize = 7
      SelectFacilityListObj.PageNum = 1
      SelectFacilityListObj.TypeId = ''

      if (searchSlect.value.selectId == '1') {
        SelectFacilityListObj.DeviceName = searchValue.value
      } else if (searchSlect.value.selectId == '2') {
        SelectFacilityListObj.DeviceId = searchValue.value
      } else {
        message.warn('请选择搜索类型')
        return;
      }

      SelectFacilityList.length = 0
      SelectFacilityList.push({  //搜索
        facility: []
      })

      SelectGetfacilityList(true)
      console.log('搜索设备')
    }

    // 重置页数
    function resetObj(y, type) {
      // console.log(index)
      // for (let y = 0; y < facilityListObj.length; y++) {
      // facilityListObj[y].TypeId = ''
      if (type == 'index') {
        facilityListObj[y].PageSize = 7
        facilityListObj[y].PageNum = 1
      } else if (type == 'sou') {
        SelectFacilityListObj.PageSize = 7
        SelectFacilityListObj.PageNum = 1
      } else if (type == 'indexAll') {
        for (let y = 0; y < facilityListObj.length; y++) {
          // facilityListObj[y].TypeId = ''
          facilityListObj[y].PageSize = 7
          facilityListObj[y].PageNum = 1

        }
        // SelectFacilityListObj.TypeId = ''

      }
    }

    // }


    // 分类型查询
    function SelectCut(id, index, fuId) {

      if (id == '0') {
        resetObj(index, 'index')
        if (facilityTabIndex.value == '0') {
          console.log(index)
          getfacilityList(index, true)

        } else {
          resetObj(null, 'sou')
          SelectFacilityListObj.TypeId = fuId
          SelectFacilityListObj.PageSize = 7
          SelectFacilityListObj.PageNum = 1
          SelectGetfacilityList(true)
        }
        // console.log(fuId)
      } else {
        resetObj(index, 'index')
        if (facilityTabIndex.value == '0') {
          console.log(index)
          getfacilityList(index, true, id)

        } else {
          resetObj(null, 'sou')
          SelectFacilityListObj.TypeId = id
          SelectFacilityListObj.PageSize = 7
          SelectFacilityListObj.PageNum = 1
          SelectGetfacilityList(true)
        }

      }
    }

    // 详情
    function pathDetail(id) {
      go('/facilityset/facility_detail/' + id)
    }

    // 启动
    function enableDevice(id, index1, index2) {
      console.log(index1, index2)
      console.log(facilityList[index1].facility[index2].NetworkStatus)
      if (facilityTabIndex.value == '0' && !SearchStatus.value) {
        // nextTick(() => {
        facilityList[index1].facility[index2].NetworkStatus = 1
        // })
      } else {
        // nextTick(() => {
        SelectFacilityList[index1].facility[index2].NetworkStatus = 1
        // })
      }
      console.log(facilityList)

      facilityEnableApi({ 'Id': id }).then(res => {
        if (res == 0) {
          message.success('操作成功')
        } else {
          message.error('操作失败')
        }
        // console.log(res)
      })

    }

    // 禁用
    function disableDevice(id, index1, index2) {
      facilityCheckRuleApi({ 'Id': id }).then(res => {
        console.log('dsajdisa', res)
        if (res == 2) {
          if (facilityTabIndex.value == '0' && !SearchStatus.value) {
            // nextTick(() => {
            facilityList[index1].facility[index2].NetworkStatus = 2
            // })
          } else {
            // nextTick(() => {
            SelectFacilityList[index1].facility[index2].NetworkStatus = 2
            // })
          }

          facilityDisableApi({ 'Id': id }).then(res => {
            console.log(res)
          })
          message.success('操作成功')

        } else if(res == 1){
        sceneStopId.value = id
        sceneStopModal.value = true
        
        }else{
          message.error('操作失败')
        }

      })
    }

    // 关闭删除弹窗
    const handleClock = (index, index2) => {
      ModalShow.value[index].model[index2] = false
    };

    // 确认移出
    const handleOk = (index, index2) => {
      // console.log()
      if (facilityTabIndex.value == '0' && !SearchStatus.value) {
        var id = facilityList[index].facility[index2].DeviceId
      } else {
        var id = SelectFacilityList[0].facility[index2].DeviceId
      }

      facilityRelieveApi({ 'DeviceId': id }).then(res => {
        if (res == 0) {
          // ModalShow.value[index].model[index2].
          message.success('移出成功')

          if (facilityTabIndex.value == '0' && !SearchStatus.value) {
            facilityList[index].facility.splice(index2, 1)
            ModalShow.value[index].model[index2] = false

            ModalShow.value[index].model.splice(index2, 1)
          } else {
            SelectFacilityList[0].facility.splice(index2, 1)

            ModalShow.value[0].model[index2] = false

            ModalShow.value[0].model.splice(index2, 1)
          }
        } else {
          message.success('移出失败')

        }
        // console.log(res)
      })
      ModalShow.value[index].model[index2] = true
    };

    // 搜索select 赋值
    function searchSlectCut(val, data) {
      searchSlect.value.selectId = data.key
      searchSlect.value.selectValue = val
    }

    const showModalClick = (index, index2) => {
      if (facilityList[index].facility[index2].NetworkStatus == 2) {
        message.warn('设备处于禁用状态，无法移出')
        return
      }
      ModalDeviceName.value = facilityList[index].facility[index2].DeviceName

      ModalShow.value[index].model[index2] = true
    };

    const computedStatus = (status, type) => {
      // console.log(status)
      switch (status) {
        case 1:
          return type ? 'bg-green-200' : 'bg-green-500'
        case 2:
          return type ? 'bg-gray-200' : 'bg-gray-500'
        case 3:
          return type ? 'bg-yellow-500' : 'bg-white'
        case 4:
          return type ? 'bg-red-200' : 'bg-red-500'
        case 5:
          return type ? 'bg-blue-500' : 'bg-white'

        default:
          return type ? 'bg-gray-200' : 'bg-gray-500'
      }
    }

    const filedName = ref({
      children: 'children', label: 'TypeName', key: 'TypeId', value: 'TypeId'
    })

    function checkTime(time) {
      let date = new Date(time * 1000);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

      let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
      let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
      let strDate = Y + M + D + h + m + s;
      return strDate
    }

    function checkcheckTypeTree(id) {
      for (var i = 0; i < facilityList.length; i++) {
        if (facilityList[i].facilityTab.TypeId == id) {
          return facilityList[i].facilityTab.TypeName
        }
        if (facilityList[i].facilityTab.children) {
          for (var y = 0; y < facilityList[i].facilityTab.children.length; y++) {
            if (facilityList[i].facilityTab.children[y].TypeId == id) {
              return facilityList[i].facilityTab.children[y].TypeName
            }

            if (facilityList[i].facilityTab.children[y].children) {
              for (var x = 0; x < facilityList[i].facilityTab.children[y].children; x++) {
                if (facilityList[i].facilityTab.children[y].children[x].TypeId == id) {
                  return facilityList[i].facilityTab.children[y].children[x].TypeName
                }
              }
            }
          }
        }
      }

      return '待分类设备'
    }

    const RegionList = ref()
    getRegion()
    function getRegion() {
      facilityRegionListApi().then((res) => {
        // console.log(res)
        RegionList.value = res.Detail
      });
    }


    function checkcheckRegionTree(id) {

      for (var i = 0; i < RegionList.value.length; i++) {
        // console.log('RegionList',id,RegionList.value[i].RegionId)
        if (RegionList.value[i].RegionId == id) {
          return RegionList.value[i].RegionName
        }
      }
      return '暂无区域'
    }

    // sondata树
    function tree(data) {
      // debugger;
      console.log('data', data)
      let Array = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].SonData) {

          let obj = data[i].SelfData
          obj.children = tree(data[i].SonData)

          Array.push(obj)
        } else {
          let obj = data[i].SelfData
          Array.push(obj)
        }
        // Array.push(obj)
      }
      return Array;

    }

    // loading
    function openLoading(absolute: boolean) {
      compState.absolute = absolute;
      compState.loading = true;
      setTimeout(() => {
        compState.loading = false;
      }, 2000);
    }

    function stopClick() {
      facilityDisableRuleApi({ 'Id': sceneStopId.value }).then(res => {
        if (res == 0) {
          message.success('操作成功')
        } else {
          message.success('操作失败')
        }

        sceneStopModal.value = false
      })
    }
    function stopCheck() {
      go('/facilityset/facility_detail/' + sceneStopId.value +'/scene')
      
    }
    function stopClock() {
      sceneStopModal.value = false
    }


    // 设备登录
    const titles = ref([])
    registerTopAreaRef(titles)
    const current = ref("")
    registerCurrentAreaRef(current)
    const devices = ref([])
    registerDevicesRef(devices)
    connect()

    return {
      searchValue,
      searchSlect,
      filedName,
      facilityTabIndex,
      faTypeName,
      facilityListObj,
      facilityTab,
      SelectFacilityList,
      SelectFacilityListObj,
      facilityListLock,
      SelectFacilityLock,
      cutTab,
      facilityList,
      getTypeList,
      getfacilityList,
      text,
      onSearch,
      SelectCut,
      pathDetail,
      addpage,
      SelectGetfacilityList,
      enableDevice,
      disableDevice,
      titles,
      current,
      devices,
      handleClock,
      handleOk,
      ModalShow,
      ModalDeviceName,
      showModalClick,
      resetObj,
      SearchStatus,
      compState,
      computedStatus,
      searchSlectCut,
      registerModal,
      handleEdit,
      handleSuccess,
      checkTime,
      checkcheckTypeTree,
      RegionList,
      checkcheckRegionTree,
      getRegion,
      tree,
      sceneStopModal,
      sceneStopId,
      stopClick,
      stopCheck,
      stopClock
    }
  },

})

</script>
<style lang="less">
body {
  font-family: 'Alibaba PuHuiTi';
}

.sp-blue-text {
  color: rgb(22, 100, 255);
}

.sp-blue-bg {
  background: rgb(22, 100, 255);
}

.fasility-class-select {
  .ant-select-selector {
    font-size: 10px;
    border-radius: 5px !important;
    height: 22px !important;

    .ant-select-selection-item {
      line-height: 22px !important;
    }
  }
}

.ant-select-arrow {
  color: rgb(28, 92, 255) !important;
}
</style>