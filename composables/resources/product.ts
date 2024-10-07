import { Category } from "./category";
import { Unit } from "./unit";

export type Product = {
    id: number;
    name: string;
    variantType: string;
    variantValue: string;
    quantity: number;
    sellingPrice: number;
    category: Category;
    expiryDate: string;
    stockLevelAlert: number;
    costPrice: number;
    profit: number;
    discount: number;
    discountType: string;
    discountedPrice: number;
    stocks: any[];
    categoryId: number;
    productUnitId: number;
    hasVariant: boolean;
}

export type BundledProduct = {
    id: number;
    name: string;
    price: number;
    items: any[];
    productImages: any[];
}

export type BoxProduct = {
    id: number;
    name: string;
    minAmount: number;
    maxAmount: number;
    unit: any;
    category: any;
    items: any[];
    productImages: any[];
}
  