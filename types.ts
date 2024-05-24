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
  Armhole: string;
  Shoulder: string;
  Bost: string;
  UnderBost: string;
  BostPoint: string;
  HaveCut: string;
  Neeple: string;
  BlauseLength: string;
  SkirtHips: string;
  SkirtLength: string;
  GwonLength: string;
  SlipLength: string;
  RoundSlip: string;
}

export interface FemaleMeasurementCreateType {
  customer: string;
  Armhole: string;
  Shoulder: string;
  Bost: string;
  UnderBost: string;
  BostPoint: string;
  HaveCut: string;
  Neeple: string;
  BlauseLength: string;
  SkirtHips: string;
  SkirtLength: string;
  GwonLength: string;
  SlipLength: string;
  RoundSlip: string;
}

export interface FemaleMeasurementUpdateType {
  Armhole: string;
  Shoulder: string;
  Bost: string;
  UnderBost: string;
  BostPoint: string;
  HaveCut: string;
  Neeple: string;
  BlauseLength: string;
  SkirtHips: string;
  SkirtLength: string;
  GwonLength: string;
  SlipLength: string;
  RoundSlip: string;
}
