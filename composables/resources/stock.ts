import { Product } from "./product";
export type Stock = {
    id: number;
    productId: number;
    quantity: number;
    costPrice: number;
    sellingPrice: number;
    expiryDate: string;
    createdAt: string;
    updatedAt: string ;
    product: Product;
}