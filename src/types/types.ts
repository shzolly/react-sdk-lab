export interface IInventory {
  DeviceModel: string;
  Manufacturer: string;
  OperatingSystem: string;
  Connectivity: string;
  StorageCapacity: number;
  BatteryCapacity: number;
  Price: number;
  RAM:number;
  pyGUID:string;
}

export interface IPromotion {
  PromotionCode: string;
  PromotionName: string;
  ApplicableServices: string;
  EligibilityCriteria: string;
  DiscountType: string;
  DiscountValue: number;
  TermsAndConditions: string;
  pyGUID:string;
}

export interface IJourney {
  pyGUID: string;
  Label: string;
  Title: string;
  Content: string;
  ImageURL: string;
}

export type ApiResponse<T> = {
  data: T;
  status: number;
  statusText?: string;
  headers?: Record<string, unknown>;
  config?: unknown;
  request?: unknown;
};
