export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockLevel: number;
  minimumStock: number;
  description: string;
  status: "En stock" | "Stock faible" | "Rupture de stock";
  lastDelivery: string;
  nextDelivery?: string;
  supplier: string;
  image?: string;
}