export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  priceRates: PriceRate[];
}

export interface PriceRate {
  paperSize: string;
  paperThickness: number;
  pricePerUnit: number;
  quantityBreaks: QuantityBreak[];
}

export interface QuantityBreak {
  minQuantity: number;
  price: number;
}

export interface Paper {
  id?: string;
  size: string;
  thickness: number;
  costPerUnit: number;
}

export interface AdditionalCost {
  id?: string;
  name: string;
  costPerUnit: number;
}

export interface Job {
  id: string;
  paperSize: string;
  paperThickness: number;
  quantity: number;
}

export interface Order {
  id: string;
  clientId: string;
  date: string;
  jobs: Job[];
  totalAmount: number;
  cost: number;
}