// import Player from 'xgplayer';
// import HlsJsPlayer from "xgplayer-hls.js";
// import Mp4Player from 'xgplayer-mp4';
import { resultSuccess, resultError, getRequestToken, requestParams } from '../../mock/_util'
import { getToken } from '@/utils/auth'
    
import { message } from 'ant-design-vue';

var ws;
var token;
var topAreas;
var currentArea;
var devices;
var jessibucaPlayers = {}

export {
    connect,
    registerTopAreaRef,
    registerCurrentAreaRef,
    registerDevicesRef,
    send_device_command,
    list_device_by_area,
    video_stop,
    devices
}

function connect() {
    ws = new WebSocket("ws://192.168.8.180:8899/");
    ws.onopen = login;
    ws.onmessage = function (evt) {
        var msg = JSON.parse(evt.data);
        // console.log(msg)
        // debugger;
        if ('request' in msg) {
            
            if (msg.request.command == 'login') {
                token = msg.response.token;
                // list_top_area()
                subscribeDeviceStatus()
            } else if (msg.request.command == 'device') {
                console.log('msg',msg)
                if (msg.code == 0) {
                    message.success('操作成功');
                } else {
                    message.error('操作失败');
                }
            } else if (msg.request.command == 'bussiness') {
                if (msg.request.parameters.operation == 'list-top-area') {
                    msg.response.sort(function (a, b) {
                        if (a > b) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                    topAreas.value = msg.response
                    currentArea.value = msg.response[0]
                    list_device_by_area(msg.response[0])
                } else if (msg.request.parameters.operation == 'list-device-by-area') {
                    msg.response.sort(function (a, b) {
                        if (a.location.area > b.location.area) {
                            return 1
                        } if (a.location.area < b.location.area) {
                            return -1
                        } else {
                            if (a.location['device-name'] > b.location['device-name']) {
                                return 1
                            } else {
                                return -1
                            }
                        }
                    })
                    devices.value = msg.response
                    // console.log(msg)
                }
            }
        } else if ('event' in msg) {
            if (msg.event == 'device.status') {
                devices.value = msg
                // debugger;
                // var i = 0;
                // for (; i < devices.value.length; i++) {
                //     if (devices.value[i].device.id == msg.deviceId) {
                //         for (var j in msg.properties) {
                //             for (var k = 0; k < devices.value[i].properties.length; k++) {
                //                 if (devices.value[i].properties[k].model.field == j) {
                //                     devices.value[i].properties[k].value.value = msg.properties[j].value
                //                 }
                //             }
                //         }
                //         break
                //     }
                // }
                if (msg.modelId == 'wvp-channel') {
                    document.getElementById(msg.deviceId + '-cover').style.display = 'none'
                    document.getElementById(msg.deviceId + '-closeButton').style.display = 'block'
                    // new Player({
                    //     id: msg.deviceId+'-player',
                    //     url: msg.properties['realtime-addr'].value,
                    //     autoplay: true
                    // })
                    var $container = document.getElementById(msg.deviceId + '-player');
                    var showOperateBtns = true; // 是否显示按钮
                    var forceNoOffscreen = true; //
                    var jessibuca = null;
                    function create() {
                        jessibuca = new window.Jessibuca({
                            container: $container,
                            videoBuffer: 0.2, // 缓存时长
                            isResize: false,
                            text: "",
                            loadingText: "加载中",
                            debug: true,
                            showBandwidth: showOperateBtns, // 显示网速
                            operateBtns: {
                                fullscreen: showOperateBtns,
                                screenshot: showOperateBtns,
                                play: showOperateBtns,
                                audio: showOperateBtns,
                            },
                            forceNoOffscreen: forceNoOffscreen,
                            isNotMute: false,
                        },);
                    }
                    create();
                    $container.style.display = 'block'
                    jessibuca.play(msg.properties['realtime-addr'].value);
                    jessibucaPlayers[msg.deviceId] = jessibuca
                }
            }
        };
    }
}

function video_stop(e) {
    var deviceId = e.getAttribute('device')
    if (jessibucaPlayers[deviceId] != undefined) {
        jessibucaPlayers[deviceId].destroy()
        document.getElementById(deviceId + '-player').style.display = 'none'
        document.getElementById(deviceId + '-closeButton').style.display = 'none'
        document.getElementById(deviceId + '-cover').style.display = 'block'

        var cmd = {
            command: "device",
            parameters: {
                token: token,
                deviceId: deviceId,
                operation: "wvp-channel-play-stop",
            }
        }
        ws.send(JSON.stringify(cmd))
    }
}

function registerTopAreaRef(ref) {
    topAreas = ref
}

function registerCurrentAreaRef(ref) {
    currentArea = ref
}

function registerDevicesRef(ref) {
    devices = ref
}

function login() {
    const token = getToken()
    console.log('..',token)
    
    if (!token) {
        return resultError('Invalid token!')
    }
    var cmd = {
        command: "login",
        parameters: {
            token: token
        }
    }
    ws.send(JSON.stringify(cmd))
}

function subscribeDeviceStatus() {
    var cmd = {
        command: "subscribe",
        parameters: {
            token: token,
            operation: "set",
            topic: "device/status"
        }
    }
    ws.send(JSON.stringify(cmd))
}

function list_top_area() {
    var cmd = {
        command: "bussiness",
        parameters: {
            token: token,
            operation: "list-top-area"
        }
    }
    ws.send(JSON.stringify(cmd))
}

function list_device_by_area(area) {
    currentArea.value = area
    devices.value = []
    var cmd = {
        command: "bussiness",
        parameters: {
            token: token,
            operation: "list-device-by-area",
            area: area
        }
    }
    ws.send(JSON.stringify(cmd))
}

function send_device_command(e, device, model, field, vfield) {
    // console.log(vfield)
    // console.log(field)  
    // console.log(device)
    var operation = model + '-set-' + field
    var cmd = {
        command: "device",
        'session-id':token,
        parameters: {
            token: token,
            deviceId: device,
            operation: operation,
        }
    }
    
    if (vfield == 'checked') {
        cmd.parameters[field] = e
    } else if (vfield == 'value') {
        cmd.parameters[field] = e
    } else if (vfield != "") {
        cmd.parameters[field] = e
    }
    // console.log('JSON.stringify(cmd)',JSON.stringify(cmd))
    ws.send(JSON.stringify(cmd))
}