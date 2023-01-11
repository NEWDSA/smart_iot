<template>
    <div class="bg-gray-100 w-full px-5 py-2">
        <div class="text-lg flex items-center">设备信息
            <div class="pl-2" @click="editTypeXiu">
                <Icon icon="ph:pencil-line-bold" size="20" color="block"></Icon>
            </div>
        </div>

        <div class="flex flex-wrap" v-if="!editType">
            <div class="w-3/12 mt-5">设备ID：{{ infoFacility.DeviceId }}</div>
            <div class="w-3/12 mt-5">设备名称：{{ infoFacility.DeviceName }}</div>
            <div class="w-3/12 mt-5">设备类型：{{ checkType(infoFacility.TypeId) }}</div>
            <div class="w-3/12 mt-5">设备所在区域位置：{{ infoFacility.RegionalLocation }}</div>
            <div class="w-3/12 mt-5">说明：{{ infoFacility.Explain }}</div>
            <div class="w-3/12 mt-5">创建时间：{{ timeZ(infoFacility.Basic.CreatedAt.seconds) }}</div>
            <div class="w-3/12 mt-5">设备位置（经纬度）：{{ infoFacility.Latitude ? infoFacility.Latitude + ',' : '' }}
                {{ infoFacility.Longitude ? infoFacility.Longitude : '' }}</div>
        </div>

        <div class="flex flex-wrap" v-else>
            <div class="w-3/12 mt-5">设备ID：{{ infoFacility.DeviceId }}</div>
            <div class="w-3/12 mt-5">设备名称：
                <input type="text" v-model="DeviceName" />
                <!-- {{ infoFacility.DeviceName }} -->
            </div>
            <div class="w-3/12 mt-5 flex items-center">设备类型：
                <TreeSelect :defaultValue="faTypeName" v-model="faTypeName" :tree-data="TreeTableData"
                    @change="changefaType" :field-names="replaceFields" style="width: 50%;" tree-default-expand-all>
                </TreeSelect>
                <!-- {{ infoFacility.TypeId }} -->
            </div>
            <div class="w-3/12 mt-5">设备所在区域位置：
                <TreeSelect :defaultValue="RegionDataName" v-model="RegionDataName" :tree-data="RegionData"
                    @change="changeRegion" :field-names="RegionFields" style="width: 50%;" tree-default-expand-all>
                </TreeSelect>
            </div>
            <div class="w-3/12 mt-5">说明：
                <input type="text" v-model="Explain" />
            </div>
            <div class="w-3/12 mt-5">创建时间：{{ timeZ(infoFacility.Basic.CreatedAt.seconds) }}
            </div>
            <div class="w-3/12 mt-5">设备位置（经纬度）：
                <input type="text" v-model="location" />
            </div>
        </div>

        <div class="flex items-center justify-end" v-if="editType">
            <div class="px-2 py-1 rounded bg-blue-600 text-white mr-3" @click="halkSave">保存</div>
            <div class="px-2 py-1 rounded border-soild border border-blue-600 text-blue-600" @click="halkCancel">取消
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import { Icon } from '/@/components/Icon';
import { TreeSelect, DatePicker } from 'ant-design-vue';
import { facilityTypeTreeApi, facilityRegionListApi, facilityRegionInfoApi, facilityEditApi } from '@/api/facility/facility'
import { message } from 'ant-design-vue';

let emit = defineEmits(['ingoEdit'])
const props = defineProps({
    infoFacility: {
        type: Object,
        default: {}
    }
})
// const info = ref()

// const { infoFacility } = props
// watch(()=>props.infoFacility,(newVal,oldVal)=>{
//     nextTick(()=>{
//     info.value = props.infoFacility

//     })
// })
const DeviceName = ref(props.infoFacility.DeviceName)
const creatTime = ref()
const Explain = ref(props.infoFacility.Explain)
const RegionalLocation = ref(props.infoFacility.Explain)
const RegionId = ref(props.infoFacility.RegionId)
const location = ref(props.infoFacility.Latitude ? props.infoFacility.Latitude + ',' + props.infoFacility.Longitude : '')

const faTypeName = ref()
const faTypeId = ref()
const RegionDataName = ref()
const RegionDataId = ref()

onMounted(() => {
    FengfacilityTypeTree()
    GetfacilityRegionList()
    // GetfacilityRegioninfo()
})


// 获取data
const TreeTableData = reactive([])

// 获取树状列表，自己封装
function FengfacilityTypeTree() {
    TreeTableData.length = 0

    facilityTypeTreeApi().then(res => {

        for (let i = 0; i < res.length; i++) {
            TreeTableData.push(res[i].SelfData)

            if (res[i].SonData) {
                TreeTableData[i].children = []
                // console.log('res[i].SonData',res[i].SonData)
                for (let y = 0; y < res[i].SonData.length; y++) {
                    TreeTableData[i].children.push(res[i].SonData[y].SelfData)

                    if (res[i].SonData[y].SonData) {
                        // console.log(res[i].SonData[y].SonData)
                        TreeTableData[i].children[y].children = []
                        // console.log('res[i].SonData',TreeTableData)
                        for (let x = 0; x < res[i].SonData[y].SonData.length; x++) {
                            TreeTableData[i].children[y].children.push(res[i].SonData[y].SonData[x].SelfData)
                        }
                    }
                }
            }

        }
        // console.log(res)
        // 完成后自动展开
        // nextTick(expandAll);
        console.log('TreeTableData', TreeTableData)
    })

}

// 区域列表
const RegionData = ref()
function GetfacilityRegionList() {
    facilityRegionListApi().then(res => {
        RegionData.value = res
        // console.log(res)
        // console.log(res)
        // 完成后自动展开
        // nextTick(expandAll);
        // console.log('RegionList', RegionData)
    })
}

// 区域详情
function GetfacilityRegioninfo(id) {
    facilityRegionInfoApi({ RegionId: id }).then(res => {
        // RegionData.value = res.Detail
        // console.log(res)
        RegionDataName.value = res.RegionName
        // console.log(RegionDataName.value)
    })
}


const editType = ref(false)

const editTypeXiu = () => {
    if (editType.value == true) {
        return
    }
    // console.log(props.infoFacility.TypeId)
    // nextTick(()=>{
    // console.log(faType.value)

    faTypeName.value = checkType(props.infoFacility.TypeId)

    if (props.infoFacility.RegionId) {
        GetfacilityRegioninfo(props.infoFacility.RegionId)
    } else {
        RegionDataName.value = ''
    }

    faTypeId.value = props.infoFacility.TypeId
    console.log(RegionDataName)
    setTimeout(() => {
        editType.value = true
    }, 500);


}

const halkSave = () => {
    let obj = {
        DeviceId: props.infoFacility.DeviceId,
        DeviceName: DeviceName.value,
        TypeId: faTypeId.value,
        RegionalLocation: RegionDataName.value,
        RegionId: RegionDataId.value,
        Explain: Explain.value
    }

    facilityEditApi(obj).then(res => {
        // console.log(res)
        if (res == 0) {
            message.success('修改成功');
            editType.value = false
            emit('ingoEdit', props.infoFacility.DeviceId)
        } else {
            message.error('修改失败，请确认输入的内容符合格式');
            return
        }

    })

}

const halkCancel = () => {
    DeviceName.value = props.infoFacility.DeviceName
    Explain.value = props.infoFacility.Explain
    RegionalLocation.value = props.infoFacility.Explain
    RegionId.value = props.infoFacility.RegionId
    location.value = props.infoFacility.Latitude ? props.infoFacility.Latitude + ',' + props.infoFacility.Longitude : ''
    editType.value = false
}

const changefaType = (id, data) => {
    faTypeId.value = id
    // console.log(id,data,datae)
}
const changeRegion = (id, data) => {
    RegionDataName.value = data[0]
    RegionDataId.value = id
}

const checkType = (id) => {
    console.log(id)
    for (var i = 0; i < TreeTableData.length; i++) {
        if (TreeTableData[i].TypeId == id) {
            return TreeTableData[i].TypeName
        }
        if (TreeTableData[i].children) {
            for (var y = 0; y < TreeTableData[i].children.length; y++) {
                if (TreeTableData[i].children[y].TypeId == id) {
                    return TreeTableData[i].children[y].TypeName
                }

                if (TreeTableData[i].children[y].children) {
                    for (var x = 0; x < TreeTableData[i].children[i].children; x++) {
                        if (TreeTableData[i].children[y].children[x].TypeId == id) {
                            return TreeTableData[i].children[y].children[x].TypeName
                        }
                    }
                }
            }
        }
    }

}


const timeZ = (time) => {
    var date = new Date(time * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    var strDate = Y + M + D + h + m + s;
    return strDate
    //   console.log('输出内容:', strDate)

}
const replaceFields = ref({
    children: 'children', label: 'TypeName', key: 'TypeId', value: 'TypeId'
})

const RegionFields = ref({
    children: 'child', label: 'RegionName', key: 'RegionId', value: 'RegionId'
})

</script>

<style lang="less">

</style>