<template >
    <div class="text-lg flex items-center mb-5">设备控制</div>

    <div class="bg-gray-100 w-full p-2 flex">
        <div v-for="(Td, index) in tabTd" :key="index" class="w-1/4">
            {{ Td.title }}
        </div>
    </div>
    <div class="wrapEl" ref="wrapEl" v-if="model">
        <div v-for="(Th, index) in model" :key="index" class="">
            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'switch'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{ Th.value.value == false ? '关闭' : '打开' }}</div>
                <div class="w-1/4">
                    <div class="flex">
                        <div class="px-2 rounded mr-3" @click="buttomCut(true, Th)"
                            :class="Th.value.value == true ? 'bg-blue-600 text-white' : 'border-soild border border-blue-600 text-blue-600'">
                            打开</div>

                        <div class="px-2 rounded mr-3" @click="buttomCut(false, Th)"
                            :class="Th.value.value == false ? 'bg-blue-600 text-white' : 'border-soild border border-blue-600 text-blue-600'">
                            关闭</div>
                    </div>
                </div>
            </div>
            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'select'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{ returnVlaue(Th.model, Th.value.value) }}</div>
                <div class="w-1/4">
                    <div class="fasility-set-select">
                        <Select :value="returnVlaue(Th.model, Th.value.value)" class="w-25" @change="SelectCut">
                            <div :value="item.name" v-for="(item, index2) in Th.model['select-item']" :key="item.value"
                                :field="Th.model.field">
                                {{ item.value }}
                            </div>
                        </Select>
                    </div>
                </div>
            </div>

            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'slide'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{ Th.value.value }}</div>
                <div class="w-1/4">
                    <div class="flex items-center">
                        <Icon icon="fluent:subtract-circle-24-regular" size="20" color="blue"
                            @click="silderKong('jian', Th.value, Th.model, Th.model.field)"></Icon>
                        <div class="mx-2">{{ Th.value.value }} </div>
                        <Icon icon="fluent:add-circle-24-regular" size="20" color="blue"
                            @click="silderKong('jia', Th.value, Th.model, Th.model.field)"></Icon>
                    </div>
                </div>
            </div>

            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'camera'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{ Th.value.value }}</div>
                <div class="w-1/4 flex">
                    <div class="px-2 rounded mr-3 bg-blue-600 text-white" @click="buttomCut(false, Th)">
                        关闭
                    </div>
                </div>
            </div>


        </div>
    </div>
    <div class="p-3" v-else>
        暂无设备控制
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { Select } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { useLoading } from '/@/components/Loading';
import { send_device_command } from '@/utils/iot'

// 请求
import { connect, registerTopAreaRef, registerCurrentAreaRef, registerDevicesRef, devices } from '@/utils/iot'
import console from 'console';

const props = defineProps({
    DeviceModel: {
        type: String,
        default: ''
    },
    DeviceId: {
        type: String,
        default: ''
    },
    ModelId: {
        type: String,
        default: ''
    },
})
// 数组
const model = ref()
if (props.DeviceModel) {
    model.value = JSON.parse(props.DeviceModel)
    console.log('model', JSON.parse(props.DeviceModel))
}
// console.log(props.DeviceModel)
// watch(()=>props.DeviceModel,(newVal,oldVal)=>{
//     model.value = JSON.parse(props.DeviceModel)
//     console.log(model.value)
// },{
//     deep:true
// })


const wrapEl = ref()
const tabTd = reactive([
    {
        title: '功能'
    },
    {
        title: '内容'
    },
    {
        title: '当前状态'
    },
    {
        title: '操作'
    }
])

// loading
const [openWrapLoading, closeWrapLoading] = useLoading({
    target: wrapEl,
    props: {
        tip: '加载中...',
        absolute: true,
        background: 'rgba(0,0,0,.3)'
    },
});

watch(() => devices.value, (newVal, oldVal) => {
    console.log('devices.value', devices.value)
    for (var j in devices.value.properties) {
        for (let i = 0; i < model.value.length; i++) {
            // console.log('比较',model.value[i].model.field,j)
            if (model.value[i].model.field == j) {
                model.value[i].value.value = devices.value.properties[j].value
            }
        }
    }
}, {
    deep: true
})

const buttomCut = (e, data) => {

    send_device_command(e, props.DeviceId, props.ModelId, data.model.field, 'checked')

    openFnWrapLoading();
    // setTimeout(() => {

    // }, 1000);

}

const SelectCut = (e, data) => {
    // console.log(e)
    send_device_command(data.key, props.DeviceId, props.ModelId, data.field, 'value')

    openFnWrapLoading();
}

const silderKong = (type, value, model, field) => {
    if (type == 'jian') {
        var val = value.value - 1
        if (val < model['slide-range'].min) {
            return;
        }
        send_device_command(val, props.DeviceId, props.ModelId, field, 'value')
    }

    if (type == 'jia') {
        var val = value.value + 1
        if (val > model['slide-range'].max) {
            return;
        }
        send_device_command(val, props.DeviceId, props.ModelId, field, 'value')
    }

    // tabTh[index].status = data
    openFnWrapLoading();
}

function openFnWrapLoading() {
    openWrapLoading();

    setTimeout(() => {
        closeWrapLoading();
    }, 1000);
}

function returnVlaue(data, id) {
    // console.log(data,id)
    var arr = data['select-item']
    for (let i = 0; i < arr.length; i++) {
        // console.log(arre)
        if (arr[i].value == id) {
            return arr[i].name
        }
    }
}
</script>

<style lang="less">
.fasility-set-select {
    .ant-select-selector {
        font-size: 14px;
        border: 0px !important;
        height: 22px !important;
        padding: 0 !important;

        .ant-select-selection-item {
            line-height: 22px !important;
        }
    }

    .ant-select-arrow {
        color: rgb(28, 92, 255) !important;
    }
}
</style>