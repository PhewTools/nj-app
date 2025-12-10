export interface Item {
  id: string;
  name: string;
  type: 'product' | 'service';
  cost: number;
  description?: string;
}