<template>
    <div>

        <div class="flex items-center ">
            <div class="text-lg mr-10">关联场景</div>
            <div class="flex items-center">
                <Input v-model:value="searchValue">
                <template #prefix>
                    <Icon icon="ic:baseline-search"></Icon>
                </template>
                </Input>
                <a-button type="primary" @click="search()" class="ml-4">
                    搜索
                </a-button>
            </div>
        </div>

        <div class="flex items-center flex-wrap" v-if="sceneList?.length > 0">

            <div v-for="(Scene, index) in sceneList" :key="Scene.RuleId" class="w-100 mb-5">

                <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5">
                    <div class="flex items-center justify-between">
                        <div class="font-bold">{{ Scene.Name }}</div>
                        <div class="rounded-md px-2 flex items-center" :class="computedStatus(Scene.Status, true)">
                            <div class="w-1 h-1 mr-2" :class="computedStatus(Scene.Status, false)"
                                style="border-radius: 50%;"></div>
                            {{
                                Scene.Status == 1 ? '启用' : Scene.Status == 2 ? '禁用' : Scene.Status == 3 ?
                                    '异常' :
                                    Scene.Status == 4 ? '故障' : Scene.Status == 5 ? '运行' : '离线'
                            }}
                        </div>
                    </div>
                    <div class="text-gray-500 mb-5">{{ checkVisitorType(Scene.VisitorTypeId) }}</div>
                    <div class="text-gray-500">关联设备 <span class="text-black">{{
                        checkVisitorType(Scene.VisitorTypeId)
                    }}</span></div>
                    <div class="text-gray-500">关联区域 <span class="text-black">{{
                        checkVisitorType(Scene.VisitorTypeId)
                    }}</span></div>

                    <div class="bottom-but flex items-center mt-2 justify-end">
                        <!-- <Modal
                v-model:visible="ModalShow[SceneTabIndex == '0' && !SearchStatus ? index : 0].model[index2]"
                @ok="handleOk(index, index2)" @cancel="handleClock(index, index2)" title="移出设备">
                <div class="p-3">确认移出 {{ ModalDeviceName }} 此设备？</div>
            </Modal> -->
                        <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click.stop="showModalClick(index)">
                            删除
                        </div>


                        <div class="bg-gray-100 py-2 px-4 mr-3 rounded" @click.stop="handleEdit(index, index2)">
                            编辑</div>
                        <div class="sp-blue-bg text-white py-2 px-4 mr-3 rounded"
                            v-if="Scene.Status == 2 || !Scene.Status" @click.stop="enableDevice(Scene.RuleId, index)">启用
                        </div>
                        <div class="bg-red-600 text-white py-2 px-4 mr-3 rounded"
                            v-if="Scene.Status == 1 || Scene.Status == 5"
                            @click.stop="disableDevice(Scene.RuleId, index)">禁用</div>
                        <div class="bg-gray-300 text-white py-2 px-4 mr-3 rounded"
                            v-if="Scene.Status == 3 || Scene.Status == 4">启用</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="w-100 mb-5" v-if="sceneListlock == false">
    <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5"
        @click="addpage(index, SceneTabIndex)" style="height:195px;">
        更多+
    </div>
</div> -->
        <div v-else class="w-100 mb-5">
            <div class="border border-gray-200 border-solid rounded w-11/12 px-4 py-5" style="height:195px;">
                暂无联动
            </div>

        </div>

        <Pagination v-model:current="searchObj.PageNum" v-model:pageSize="searchObj.PageSize" :total="total"
            show-size-changer @change="cutPage()"></Pagination>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { Input, Pagination, message } from 'ant-design-vue';
import Icon from '@/components/Icon';
import { facilityRuleListApi,ruleEnableApi,ruleDisableApi } from '@/api/facility/facility'
// import { any } from 'vue-types';
// import { , Modal, } from 'ant-design-vue';

const props = defineProps({
    DeviceId: {
        type: Number || String,
        default: ''
    },
})

onMounted(() => {
    getSceneList(true);
})

const sceneValue = ref()
const sceneList = ref()
const searchObj = reactive(
    {
        Name: '',
        DeviceId: '888',
        PageNum: 1,
        PageSize: 10
    }
)
const searchValue = ref()
const total = ref()

// 获取列表
function getSceneList(type,name) {
    if (type) {
        searchObj.PageNum = 1
    }

    if(name){
        searchObj.Name = searchValue.value
    }else{
       delete searchObj.Name
    }
    
    facilityRuleListApi(searchObj).then(res => {
        console.log(res)
        if (res.List) {
            sceneList.value = res.List

            console.log(sceneList.value)
            // 计算分页
            // sceneListlock.value = Math.ceil(res.Page.Total / 12)
            total.value = res.Total
        } else {
            sceneList.value = []
        }

    })

}

function enableDevice(id, index) {
    ruleEnableApi({ Id: id }).then(res => {
        if (res == 0) {
            message.success('操作成功')
            sceneList.value[index].Status = 1
        } else {
            message.error('操作失败')

        }
    })
}

function disableDevice(id, index) {
    ruleDisableApi({ Id: id }).then(res => {
        if (res == 0) {
            message.success('操作成功')
            sceneList.value[index].Status = 2
        } else {
            message.error('操作失败')

        }
    })
}

function search() {
    if (searchValue.value == '') {
        getSceneList(true)
        // message.warn('请输入搜索内容')
        return;
    }
    getSceneList(true, 1)
}

function cutPage() {
    console.log(searchObj)
    // searchObj.PageNum = count
    getSceneList(false)
}

function computedStatus(status, type) {
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