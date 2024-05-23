export interface CustomerType {
  _id: string;
  names: string;
  gender: string;
  phoneNumber: string;
}

export interface CustomerUpdateType {
  names?: string;
  gender?: string;
  phoneNumber?: string;
}

export interface MaleMeasurementType {
  _id: string;
  customer: string;
  S: number;
  H: number;
  N: number;
  SL: number;
  FR: number;
  TL: number;
  Lap: number;
  FW: number;
  Links: number;
  HK: number;
  BBR: number;
}

export interface MaleMeasurementCreateType {
  customer: string;
  S: number;
  H: number;
  N: number;
  SL: number;
  FR: number;
  TL: number;
  Lap: number;
  FW: number;
  Links: number;
  HK: number;
  BBR: number;
}

export interface MaleMeasurementUpdateType {
  S?: number;
  H?: number;
  N?: number;
  SL?: number;
  FR?: number;
  TL?: number;
  Lap?: number;
  FW?: number;
  Links?: number;
  HK?: number;
  BBR?: number;
}

export interface FemaleMeasurementType {
  _id: string;
  customer: string;
  B: number;
  W: number;
  L: number;
  H: number;
  N: number;
  HL: number;
  SH: number;
  UB: number;
  WL: number;
  HP: number;
  E: number;
}

export interface FemaleMeasurementCreateType {
  customer: string;
  B: number;
  W: number;
  L: number;
  H: number;
  N: number;
  HL: number;
  SH: number;
  UB: number;
  WL: number;
  HP: number;
  E: number;
}

export interface FemaleMeasurementUpdateType {
  B?: number;
  W?: number;
  L?: number;
  H?: number;
  N?: number;
  HL?: number;
  SH?: number;
  UB?: number;
  WL?: number;
  HP?: number;
  E?: number;
}
