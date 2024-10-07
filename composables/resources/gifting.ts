import { Ref } from 'vue'
import { ApiList, ApiShow } from '../fetch'
import { Voucher } from './business'
import { Money, WalletTransaction } from './finance'
import { User } from './people'
import { Currency, ItemLog, Media, TimeStamps } from './system'

export type GiftType = 'store' | 'complimentary'

export type Gift = {
  id: number
  name: string
  description: string
  featured: boolean
  type: GiftType
  quantity: number
  storeId: number
  createdBy: number
  image?: Media
} & TimeStamps

export type PurchaseStatus =
  | 'pending'
  | 'redeemed'
  | 'cancelled'
  | 'settled'
  | 'settlement_failed'
export type VoucherType = 'gift_box' | 'digital'

export type ItemForm = {
  name: string
  price: number | null
}

export type PurchaseLog = {
  status: PurchaseStatus
  purchaseId: number
  purchase?: Purchase
} & ItemLog &
  TimeStamps

export type PurchaseItem = {
  id: number
  name: string
  price: number | null
  purchaseId: number
  createdBy: number
  creator?: User
  purchase?: Purchase
} & TimeStamps

export type Purchase = {
  id: number
  message: string
  amount: number
  currency: Currency
  money: Money
  status: PurchaseStatus
  voucherNumber: string
  voucherType: VoucherType
  voucherId: number
  addressId: number
  recipientId: number
  createdBy: number
  expiresAt: string
  recipient?: User
  creator?: User
  voucher?: Voucher
  logs?: PurchaseLog[]
  items?: PurchaseItem[]
  refunds?: WalletTransaction[]
} & TimeStamps

export const purchaseStatusMap: Record<Purchase['status'], string> = {
  cancelled: 'error',
  pending: 'warning',
  redeemed: 'success',
  settled: 'success',
  settlement_failed: 'error'
}

export const useRedeemFlow = (voucherNumber: string) =>
  useState<{ page: string; items: ItemForm[]; purchase: Purchase | undefined }>(
    `reddemFlow/${voucherNumber}`,
    () => ({
      page: `/purchases/redeem/${voucherNumber}`,
      items: [],
      purchase: undefined
    })
  )

export const useGifts = (search?: Ref<string>) => {
  const route = useRoute()
  return useApiFetch<ApiList<Gift>>('gifts', () => ({
    params: {
      'relations[]': ['image'],
      search: search?.value,
      page: route.query.page ?? 1,
      perPage: route.query.perPage ?? 10
    },
    group: 'inventory'
  }))
}
