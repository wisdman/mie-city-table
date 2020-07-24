
export type IMappingItemType = "BUILDING" | "RIVER" | "BUTTON"

export type IMappingBUILDING = {
  id: number
  type: "BUILDING"
  enable: boolean
  points: Array<[number, number]>
  background: string
}

export type IMappingFIELD = {
  id: number
  type: "FIELD"
  enable: boolean
  points: [[number, number], [number, number], [number, number], [number, number]]
  background: string
}

export type IMappingKINECT = {
  id: number
  type: "KINECT"
  enable: boolean
  points: Array<[number, number, number]>
  action: string
}

export type IMappingItem = IMappingBUILDING | IMappingFIELD | IMappingKINECT

export type IMappingData = Array<IMappingItem>