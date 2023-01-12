export interface facilityListParams {
    TypeId: string
    PageSize: string
    PageNum: string
    DeviceName:string
}

export interface facilityDetailParams {
    Id: string
}

export interface facilityEditParams {
    DeviceId: string | Number
    DeviceName: string
    TypeId: string | Number
    RegionalLocation: string
    RegionId: string | Number
    Explain:string
}

export interface facilityClassParams {
    TypeName: string
    ParentId: string
}

export interface facilityEditClassParams {
    TypeId: number
    TypeName: string
    ParentId: number
    SortPosition: number
}

export interface facilityLogParams {
    DeviceSerial: string
    PageSize: string
    PageNum: string
}

export interface facilityAlertParams {
    DeviceSerial: string
    PageSize: string
    PageNum: string
    SortMode:Number
    AlertMode:Number
    AlertContent:string
}

export interface facilityAlertPostParams {
    Id: string
}