import { BankAccount, Money } from './finance'
import { User } from './people'
import { Address } from './places'
import { Currency, Media, PLACEHOLDER_IMAGE, TimeStamps } from './system'
import { faker } from '@faker-js/faker'
import { FormFile } from '../form'

export type StoreCategory = {
  id: number
  name: string
  code: string
}
export type StoreStatus = 'active' | 'suspended' | 'closed'

export type Store = {
  id: number
  name: string
  description: string
  featured: boolean
  commisionPercentage: number
  status: StoreStatus
  createdBy: number
  address?: Address
  bankAccount?: BankAccount
  categories?: StoreCategory[]
  creator?: User
  logo?: Media
  productImages?: Media[]
  vouchers?: Voucher[]
}

export type Voucher = {
  id: number
  amount: number
  currency: Currency
  storeId: number
  createdBy: number
  store?: Store
} & TimeStamps

export type StoreRequest = {
  name: string
  description: string
  categoryIds: number[]
  address: {
    address: string
    longitude: number | undefined
    latitude: number | undefined
  }
  bankAccount: {
    accountNumber: string | undefined
    bank: string
  }
  commisionPercentage: number | null
  vouchers: Money[]
}

export type StoreForm = {
  name: string
  description: string
  categories: StoreCategory[]
  address: google.maps.places.QueryAutocompletePrediction
  bankAccount: { accountNumber: string; bank?: { code: string; name: string } }
  commisionPercentage: number | null
  vouchers: Money[]
  logo: FormFile
  productImages: FormFile[]
}



export const defaultStore: StoreForm = {
  name: '',
  description: '',
  categories: [],
  address: {
    description: '',
    matched_substrings: [],
    terms: []
  },
  bankAccount: { accountNumber: '', bank: { code: '', name: '' } },
  commisionPercentage: 10,
  vouchers: [],
  logo: { fileUrl: PLACEHOLDER_IMAGE },
  productImages: []
}

export type Stock = {
  quantity: number,
  costPrice: number,
  sellingPrice: number,
  expiryDate: string,
  stockLevelAlert: number,
  variantValueIds: number[],
};

export type ProductForm = {
  id: number | null,
  name: string,
  quantity: number | null,
  unit: { id: number | null, name: string, code: string },
  hasVariant: number | null,
  variant: { id: number | null, name: string, type: string, value: string, createdAt: string, updatedAt: string },
  variantType: string,
  variantName: string,
  category: { id: number | null, name: string, code: string },
  costPrice: number | null,
  stock: number | null,
  sellingPrice: number | null,
  discount: number | null,
  expDate: string,
  profit: number | null,
  discountedPrice: number | null,
  discountType: string,
  stocks: Stock[]; // Add the stocks array
};

export const defaultProduct: ProductForm = {
  id: null,
  name: '',
  quantity: null,
  unit: { id: null, name: 'Select Unit', code: '' }, // Adjusted code to an empty string
  hasVariant: null,
  variant: {
    id: null,
    name: 'default',
    type: 'default',
    value: 'default value', // Adjusted to a more meaningful default value
    createdAt: '', // Could also use a date-time string if needed
    updatedAt: ''  // Could also use a date-time string if needed
  },
  variantType: '',
  variantName: '',
  category: { id: null, name: 'Select Category', code: '' }, // Adjusted code to an empty string
  costPrice: null,
  stock: null,
  sellingPrice: null,
  discount: null,
  expDate: '', // Adjusted to an empty string
  profit: null,
  discountedPrice: null,
  discountType: 'percentage',
  stocks: [ // Added a default empty stock entry
    {
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      expiryDate: '', // Adjusted to an empty string
      stockLevelAlert: 0,
      variantValueIds: [] // Default empty array
    }
  ]
};



export type VariantValue = {
  id: number | null;
  quantity: number | null;
  price: number | null;
  name: string | null; 
};

export type VariableProductForm = {
  id: number | null;
  name: string;
  quantity: number | null;
  unit: { id: number | null, name: string, code: string } | null;
  category: { id: number | null, name: string, code: string }  | null;
  costPrice: number | null;
  stock: number | null;
  sellingPrice: number | null;
  discount: number | null;
  expDate: string;
  profit: number | null;
  discountedPrice: number | null;
  discountType: string;
  variant: {
    id: number | null;
    variantValue: VariantValue[]
    variantType: string
  } 
};

export const defaultVariableProduct: VariableProductForm = {
  id: null,
  name: '',
  quantity: null,
  unit: { id: null, name: 'Select Unit', code: 'null' },
  category: { id: null, name: 'Select Category', code: 'null' },
  costPrice: null,
  stock: null,
  sellingPrice: null,
  discount: null,
  expDate: '',
  profit: null,
  discountedPrice: null,
  discountType: 'percentage',
  variant:{
    id: null,
    variantValue: [],
    variantType: 'single'
  } 
};



export type ProductUnit ={
  id: number,
  name: string,
  status: string,
  createdAt: string,
  updatedAt: string
}

export type Variant = {
  id: number;
  name: string;
  type: string | null;
  value: string | null;
  createdAt: string;
  updatedAt: string;
  values: Array<{
      id: number;
      variantId: number;
      value: string;
      createdAt: string;
      updatedAt: string;
  }>;
}

export type ServiceForm = {
  id: number 
  name: string,
  description: string,
  category: {
    id: number | null,
    name: string,
    code: string
  },
  costPrice: number | null,
  sellingPrice: number | null,
  discount: number | null,
  profit: number | null,
  discountedPrice: number | null,
  discountType: string,
  createdAt: string,
  updatedAt: string
}

export const defaultService: ServiceForm = {
  id: 0,
  name: '',
  description: '',
  category: { id: 0, name: 'Select Category', code: 'null' },
  costPrice: null,
  sellingPrice: null,
  discount: null,
  profit: null,
  discountedPrice: null,
  discountType: 'percentage',
  createdAt: '',
  updatedAt: '',
}



export const fakeStore: StoreForm = {
  name: faker.company.bs(),
  description: faker.lorem.paragraph(3),
  categories: [{ id: 1, name: 'Flower Shop', code: 'flower-shop' }],
  address: {
    description: '48 odogbolu street',
    matched_substrings: [],
    terms: []
  },
  bankAccount: {
    accountNumber: faker.finance.account(10),
    bank: { code: '034', name: 'Xslnce Microfinance Bank' }
  },
  commisionPercentage: 10,
  vouchers: [{ amount: 10_000, currency: 'NGN' }],
  logo: defaultStore.logo,
  productImages: defaultStore.productImages
}
