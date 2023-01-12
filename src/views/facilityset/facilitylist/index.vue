<template>
  <div>
    <div class="p-5 bg-white">
      <div class="text-lg font-bold">设备列表</div>

      <div class="my-4 md:flex items-center">
        <div class="flex">
          <div class="px-3 py-1 mr-2" v-for="(item, index) in facilityTab" :key="item.id"
            :class="facilityTabIndex == index ? 'bg-gray-100 sp-blue-text rounded-2xl' : ''"
            @click="cutTab(item.TypeId, index)">
            {{ item.TypeName }}
          </div>
        </div>
        <div class="search md:ml-10 mt-3 md:mt-0">
          <a-input-search v-model:value="searchValue" placeholder="搜索" class="w-full md:w-50 " @search="onSearch" />
        </div>
      </div>


      <div class="facility-list">
        <div class="mb-5"
          v-for="(item, index) in facilityTabIndex == 0 && !SearchStatus ? facilityList : SelectFacilityList ">
          <div class="flex items-center mb-5" v-if="!SearchStatus">
            <div class="text-df font-bold mr-5">{{ item.facilityTab.TypeName }}</div>

            <div>
              <div class="fasility-class-select" v-if="item.facilityTab.children">
                <!-- //v-for="(Sonvalue, index) in item.facilitySonTab" -->
                <TreeSelect :defaultValue="faTypeName[facilityTabIndex == '0' ? index : 0]"
                  v-model:value="faTypeName[facilityTabIndex == '0' ? index : faTypeName.length - 1]"
                  :tree-data="facilityTabIndex == 0 ? facilityTab[index + 1].children : facilityTab[facilityTabIndex].children"
                  @change="SelectCut($event, index, item.facilityTab.TypeId)" :field-names="filedName"
                  style="width: 200px;" tree-default-expand-all>
                </TreeSelect>

              </div>

            </div>

          </div>
          <div class="flex items-center flex-wrap" v-if="item.facility.length > 0">

            <div v-for="(facility, index2) in item.facility" :key="facility.DeviceId" class="w-100 mb-5">

              <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5">
                <div class="flex items-center justify-between">
                  <div class="font-bold">{{ facility.DeviceName }}</div>
                  <div class="rounded-md px-2 flex items-center"
                    :class="facility.NetworkStatus == 1 ? 'bg-green-100 text-green-500' : facility.NetworkStatus == 2 ? 'bg-red-100 text-red-500' : 'bg-yellow-400 text-white'">
                    <div class="w-1 h-1 mr-2"
                      :class="facility.NetworkStatus == 1 ? 'bg-green-500' : facility.NetworkStatus == 2 ? 'bg-red-500' : 'bg-white'"
                      style="border-radius: 50%;"></div>
                    {{
                      facility.NetworkStatus == 1 ? '在线' : facility.NetworkStatus == 2 ? '离线' : facility.NetworkStatus
                        == 3 ? '异常' : facility.NetworkStatus == 4 ? '故障' : '运行'
                    }}
                  </div>
                </div>
                <div class="text-gray-500 mb-5">ID:{{ facility.DeviceId }}</div>
                <div class="text-gray-500">设备类型 <span class="text-black">{{ facility.TypeId }}</span></div>
                <div class="text-gray-500">设备名称 <span class="text-black">{{ facility.RegionId }}</span></div>

                <div class="bottom-but flex items-center mt-2 justify-end">
                  <Modal v-model:visible="ModalShow[facilityTabIndex == '0' && !SearchStatus ? index : 0].model[index2]"
                    @ok="handleOk(index, index2)" @cancel="handleClock(index, index2)" title="删除设备">
                    <div class="p-3">确认删除此设备？</div>
                  </Modal>
                  <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click="showModalClick(index, index2)">删除</div>
                  <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click="pathDetail(facility.DeviceId)">编辑</div>
                  <div class="sp-blue-bg text-white py-2 px-4 mr-3 rounded" v-if="facility.NetworkStatus == 2"
                    @click="enableDevice(facility.DeviceId, index, index2)">启用</div>
                  <div class="bg-red-600 text-white py-2 px-4 mr-3 rounded" v-if="facility.NetworkStatus == 1"
                    @click="disableDevice(facility.DeviceId, index, index2)">禁用</div>
                </div>
              </div>
            </div>
            <div class="w-100 mb-5"
              v-if="facilityTabIndex == 0 && !SearchStatus ? facilityListLock[index] == false : SelectFacilityLock == false">
              <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5"
                @click="addpage(index, facilityTabIndex)">
                更多+
              </div>
            </div>
          </div>

          <div v-else class="w-100 mb-5">
            暂无设备
          </div>

        </div>
      </div>

    </div>

    <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" :background="compState.background"/>
  </div>
</template>
<script lang="ts" >
import { ref, reactive, defineComponent, nextTick, watch } from 'vue';
import { Select, Modal, TreeSelect } from 'ant-design-vue';
import { useGo } from '@/hooks/web/usePage';
import { facilityListApi, facilityTypeTreeApi, facilityEnableApi, facilityDisableApi, facilityDeleteApi } from '@/api/facility/facility'
import { connect, registerTopAreaRef, registerCurrentAreaRef, registerDevicesRef } from '@/utils/iot'
import { message } from 'ant-design-vue';
import { Loading } from '@/components/Loading';
import console from 'console';
export default defineComponent({
  name: 'Facilitylist',
  components: { Select, Modal, TreeSelect,Loading },
  setup() {
    const go = useGo();
    const searchValue = ref('');
    const facilityTabIndex = ref('0');
    const faTypeName = ref([])
    const facilityListObj = reactive([]);
    const facilityListLock = reactive([]);
    const SelectFacilityList = reactive([]);
    const SelectFacilityListObj = reactive({
      TypeId: '',
      PageSize: 7,
      PageNum: 1,
      DeviceName: ''
    });
    const SelectFacilityLock = ref(false)

    const SearchStatus = ref(false)  //搜索

    const ModalShow = ref([])
    // const showFacilityTab = ref()

    const facilityTab = reactive([
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

    //切换分类 
    function cutTab(TypeId, index) {
      SelectFacilityList.length = 0
      SelectFacilityListObj.PageNum = 1
      facilityListObj.PageNum = 1

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
          // debugger;
        }
      }

      if (SearchStatus.value = true) {
        SearchStatus.value = false
        SelectFacilityListObj.DeviceName = ''
      }

      // nextTick(() => {
      //   for (let o = 0; o < faTypeName.value.length; o++) {

      faTypeName.value[faTypeName.value.length - 1] = '全部' //重置分类列表页的select
      //   }
      // })
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
            SelectGetfacilityList()

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
        console.log(res)
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

    const facilityList = reactive([
      // {
      //   facilityTab: '网关设备',
      //   facilityClass: [
      //     {
      //       label: '全部'
      //     },
      //     {
      //       label: '分类1'
      //     }
      //   ],
      //   facilityClassIndex: '全部',
      //   facility: [
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
        getfacilityList(index)
      } else {
        SelectFacilityListObj.PageNum += 1
        SelectGetfacilityList()
      }

    }

    // 初始化
    getTypeList()
    function getTypeList() {
      openLoading(false);
      facilityTypeTreeApi().then(res => {
        console.log('res', res)
        for (let i = 0; i < res.length; i++) {
          // 暂存
          facilityTab.push(res[i].SelfData) //push设备类别的tab栏

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
          // console.log('res[i]',res[i])
          // console.log('facilityList[i].facilityTab[i]',facilityList[i].facilityTab)

          if (res[i].SonData) {
            // console.log('facilityList[i].facilityTab[i]',facilityList[i].facilityTab[i])
            facilityList[i].facilityTab.children = [{ //添加一个全部的选项
              TypeId: '0',
              TypeName: "全部"
            }]
            console.log('res[i].SonData', res[i].SonData)
            for (let y = 0; y < res[i].SonData.length; y++) {    //封装成自己的数据 打印就知道了

              facilityList[i].facilityTab.children.push(res[i].SonData[y].SelfData)

              if (res[i].SonData[y].SonData) {
                // console.log(res[i].SonData[y].SonData)
                facilityList[i].facilityTab.children[y + 1].children = []
                // console.log('res[i].SonData',facilityList[i].facilityTab)
                for (let x = 0; x < res[i].SonData[y].SonData.length; x++) {
                  facilityList[i].facilityTab.children[y + 1].children.push(res[i].SonData[y].SonData[x].SelfData)

                }
              }
            }
          }

        }
        // console.log('faTypeName',faTypeName)
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
      new Promise((resove, reject) => {
        //自定义请求参数
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

          if (res == '') { //如果没数据
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
      SelectFacilityListObj.DeviceName = searchValue.value

      SelectFacilityList.length = 0
      SelectFacilityList.push({  //搜索
        facility: []
      })


      SelectGetfacilityList(true)


      console.log('搜索设备')
    }

    // 重置页数
    function resetObj() {
      for (let y = 0; y < facilityListObj.length; y++) {
        // facilityListObj[y].TypeId = ''
        facilityListObj[y].PageSize = 7
        facilityListObj[y].PageNum = 1
      }

      // SelectFacilityListObj.TypeId = ''
      SelectFacilityListObj.PageSize = 7
      SelectFacilityListObj.PageNum = 1
    }

    // 分类型查询
    function SelectCut(id, index, fuId) {
      resetObj()
      if (id == '0') {

        if (facilityTabIndex.value == '0') {
          console.log(index)
          getfacilityList(index, true)

        } else {
          SelectFacilityListObj.TypeId = fuId
          SelectFacilityListObj.PageSize = 7
          SelectFacilityListObj.PageNum = 1
          SelectGetfacilityList(true)
        }
        // console.log(fuId)
      } else {

        if (facilityTabIndex.value == '0') {
          console.log(index)
          getfacilityList(index, true, id)

        } else {
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
      if (facilityTabIndex.value == '0') {
        nextTick(() => {
          facilityList[index1].facility[index2].NetworkStatus = 1
        })
      } else {
        nextTick(() => {
          SelectFacilityList[index1].facility[index2].NetworkStatus = 1
        })
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
      if (facilityTabIndex.value == '0') {
        nextTick(() => {
          facilityList[index1].facility[index2].NetworkStatus = 2
        })
      } else {
        nextTick(() => {
          SelectFacilityList[index1].facility[index2].NetworkStatus = 2
        })
      }

      facilityDisableApi({ 'Id': id }).then(res => {
        console.log(res)
      })

    }

    // 关闭删除弹窗
    const handleClock = (index, index2) => {
      ModalShow.value[index].model[index2] = false
    };

    const handleOk = (index, index2) => {
      // console.log()
      if (facilityTabIndex.value == '0' && !SearchStatus.value) {
        var id = facilityList[index].facility[index2].DeviceId
      } else {
        var id = SelectFacilityList[0].facility[index2].DeviceId
      }

      facilityDeleteApi({ 'Ids': [id] }).then(res => {
        if (res == 0) {
          // ModalShow.value[index].model[index2].
          nextTick(() => {
            message.success('删除成功')

            if (facilityTabIndex.value == '0' && !SearchStatus.value) {
              facilityList[index].facility.splice(index2, 1)
              ModalShow.value[index].model[index2] = false

              ModalShow.value[index].model.splice(index2, 1)
            } else {
              SelectFacilityList[0].facility.splice(index2, 1)

              ModalShow.value[0].model[index2] = false

              ModalShow.value[0].model.splice(index2, 1)
            }
          })
        } else {
          message.success('删除失败')

        }
        // console.log(res)
      })
      ModalShow.value[index].model[index2] = true
    };

    const showModalClick = (index, index2) => {
      ModalShow.value[index].model[index2] = true
    };


    const filedName = ref({
      children: 'children', label: 'TypeName', key: 'TypeId', value: 'TypeId'
    })


    // loading
    function openLoading(absolute: boolean) {
      compState.absolute = absolute;
      compState.loading = true;
      setTimeout(() => {
        compState.loading = false;
      }, 2000);
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
      showModalClick,
      resetObj,
      SearchStatus,
      compState
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