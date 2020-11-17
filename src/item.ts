export interface Item {
  barcode: string;
  name: string;
  unit: string;
  price: number;
}
export interface Data {
  item: Item;
  count: number;
  isInPromotions: boolean;
}
