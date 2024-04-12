export interface CustomerType {
  id: string;
  names: string;
  gender: string;
  phoneNumber: string;
}

export interface CustomerUpdateType {
  names?: string;
  gender?: string;
  phoneNumber?: string;
}
