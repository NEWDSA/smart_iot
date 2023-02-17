<template >
    <div class="text-lg flex items-center mb-5">设备控制</div>

    <div class="bg-gray-100 w-full p-2 flex">
        <div v-for="(Td, index) in tabTd" :key="index" class="w-1/4">
            {{ Td.title }}
        </div>
    </div>
    <div class="wrapEl" ref="wrapEl" v-if="model && (!NetworkStatus || NetworkStatus != 2)">
        <div v-for="(Th, index) in model" :key="index" class="">
            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'switch'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{
                    Th.value.value == false ? '关闭'
                        : '打开'
                }}</div>

                <div class="w-1/4"  v-if="ModelId == 'curtain'">
                    <div class="flex">
                        <div class="px-2 rounded mr-3" @click="buttomCut(1, Th)"
                            :class="Th.value.value == 1 ? 'bg-blue-600 text-white' : 'border-soild border border-blue-600 text-blue-600'">
                            全开</div>

                        <div class="px-2 rounded mr-3" @click="buttomCut(0, Th)"
                            :class="Th.value.value == 2 ? 'bg-blue-600 text-white' : 'border-soild border border-blue-600 text-blue-600'">
                            停止</div>

                        <div class="px-2 rounded mr-3" @click="buttomCut(2, Th)"
                            :class="Th.value.value == 0 ? 'bg-blue-600 text-white' : 'border-soild border border-blue-600 text-blue-600'">
                            全关</div>
                    </div>
                </div>

                <div class="w-1/4"  v-else>
                    <div class="flex">
                        <div class="px-2 rounded mr-3" @click="buttomCut(1, Th)"
                            :class="Th.value.value == 1 ? 'bg-blue-600 text-white' : 'border-soild border border-blue-600 text-blue-600'">
                            打开</div>

                        <div class="px-2 rounded mr-3" @click="buttomCut(0, Th)"
                            :class="Th.value.value == 0 ? 'bg-blue-600 text-white' : 'border-soild border border-blue-600 text-blue-600'">
                            关闭</div>
                    </div>
                </div>

            </div>
            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'select'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{
                    returnVlaue(Th.model,
                    Th.value.value)
                }}</div>
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
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{ Th.value.value }} {{
                    Th.model.field == "percentage" ? '%' : '121'
                }}</div>
                <div class="w-1/4">
                    <div class="flex items-center">

                        <Icon icon="fluent:subtract-circle-24-regular" size="20" color="blue"
                            @click="silderKong('jian', Th.value, Th.model, Th.model.field)">
                        </Icon>

                        <div class="mx-2">
                            <Input type="number" v-model:value="Th.value.value"
                                @change="silderKong('input', Th.value.value, Th.model, Th.model.field)"
                                style="width: 5rem;">
                            <template #suffix>
                                {{ Th.model.field == "percentage" ? '%' : '' }}
                            </template>
                            </Input>
                            <!-- {{ Th.value.value }}{{ Th.model.field == "percentage" ? '%' : ''}} -->
                        </div>

                        <Icon icon="fluent:add-circle-24-regular" size="20" color="blue"
                            @click="silderKong('jia', Th.value, Th.model, Th.model.field)">
                        </Icon>


                    </div>
                </div>
            </div>

            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'camera'">
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

    <!-- 禁用 -->
    <div class="" v-else-if="NetworkStatus == 0 || NetworkStatus == 2">
        <div v-for="(Th, index) in model" :key="index" class="">
            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'switch'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{
                    Th.value.value == false ? '关闭'
                        : '打开'
                }}</div>

                <div class="w-1/4" v-if="ModelId == 'curtain'">
                    <div class="flex">
                        <div class="px-2 rounded mr-3"
                            :class="Th.value.value == 1 ? 'bg-gray-500 text-white' : 'border-soild border border-grey-600 text-grey-600'">
                            全开</div>

                        <div class="px-2 rounded mr-3" 
                            :class="Th.value.value == 0 ? 'bg-gray-500 text-white' : 'border-soild border border-grey-600 text-grey-600'">
                            停止</div>

                        <div class="px-2 rounded mr-3"
                            :class="Th.value.value == 2 ? 'bg-gray-500 text-white' : 'border-soild border border-grey-600 text-grey-600'">
                            全关</div>
                    </div>
                </div>

                <div class="w-1/4">
                    <div class="flex">
                        <div class="px-2 rounded mr-3"
                            :class="Th.value.value == 1 ? 'bg-gray-500 text-white' : 'border-soild border border-grey-600 text-grey-600'">
                            打开</div>

                        <div class="px-2 rounded mr-3"
                            :class="Th.value.value == 0 ? 'bg-gray-500 text-white' : 'border-soild border border-grey-600 text-grey-600'">
                            关闭</div>
                    </div>
                </div>

            </div>
            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'select'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{
                    returnVlaue(Th.model,
                    Th.value.value)
                }}</div>
                <div class="w-1/4">
                    <div class="fasility-set-select">
                        <Select :value="returnVlaue(Th.model, Th.value.value)" class="w-25" @change="SelectCut"
                            disabled>
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
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{ Th.value.value }} {{
                    Th.model.field == "percentage" ? '%' : '121'
                }}</div>
                <div class="w-1/4">
                    <div class="flex items-center">

                        <Icon icon="fluent:subtract-circle-24-regular" size="20" color="gray">
                        </Icon>

                        <div class="mx-2">
                            <Input type="number" v-model:value="Th.value.value" disabled style="width: 5rem;">
                            <template #suffix>
                                {{ Th.model.field == "percentage" ? '%' : '' }}
                            </template>
                            </Input>
                            <!-- {{ Th.value.value }}{{ Th.model.field == "percentage" ? '%' : ''}} -->
                        </div>

                        <Icon icon="fluent:add-circle-24-regular" size="20" color="gray">
                        </Icon>

                    </div>
                </div>
            </div>

            <div class="w-full flex p-2 border-b border-gray-100 border-solid" v-if="Th.model.view == 'camera'">
                <div class="w-1/4">{{ Th.model.name }}</div>
                <div class="w-1/4 overflow-hidden overflow-ellipsis whitespace-nowrap">{{ Th.value.value }}</div>
                <div class="w-1/4 flex">
                    <div class="px-2 rounded mr-3 bg-gray-400 text-white">
                        关闭
                    </div>
                </div>
            </div>


        </div>

        <!-- 设备处于禁用状态 -->
    </div>
    <div class="p-3" v-else-if="!model && NetworkStatus != 0 || NetworkStatus != 2">
        <!-- && NetworkStatus != 0 || NetworkStatus != 2 -->
        暂无设备控制
    </div>
</template>

<script setup>
import { ref, reactive, watch, onDeactivated } from 'vue';
import { Select, Input } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { useLoading } from '/@/components/Loading';
import { send_device_command } from '@/utils/iot'

// 请求
import { connect, registerTopAreaRef, registerCurrentAreaRef, registerDevicesRef, devices } from '@/utils/iot'
import { number } from 'vue-types';

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
    NetworkStatus: {
        type: Number,
        default: 0
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
        title: '当前状态'
    },
    {
        title: '操作'
    }
])

// loading
const [openWrapLoading, closeWrapLoading] = useLoading({
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
            console.log('比较', model.value[i].model.field, j)
            if (model.value[i].model.field == j) {
                model.value[i].value.value = devices.value.properties[j].value
            }
        }
    }
}, {
    deep: true
})

// 个别设备登录 subscribeDeviceStatusNew


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

const silderKong = (type, value, model, field, event) => {
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
    if (type == 'input') {
        // var val = value.value + 1
        // if (val > model['slide-range'].max) {
        //     return;
        // }
        console.log(value)
        send_device_command(value, props.DeviceId, props.ModelId, field, 'value')
    }

    // console.log('event',event)
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