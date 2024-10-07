import { User } from './people'
import { Currency, Entity, TimeStamps } from './system'

export type PaystackBank = {
  name: string
  slug: string
  code: string
  longcode: string
  gateway: string | null
  pay_with_bank: boolean
  active: boolean
  is_deleted: boolean
  country: string
  currency: string
  type: string
  id: number
  createdAt: string
  updatedAt: string
}

export type Money = { amount: number; currency: Currency }

export type BankAccountStatus = 'unverified' | 'verified'

export type BankAccount = {
  id: number
  bank: { name: string; code: string }
  name: string
  accountNumber: string
  refId: number
  entity: Entity
  status: BankAccountStatus
}

export type TransactionType = 'credit' | 'debit'

export type TransactionReason = 'purchase_refund' | 'paystack_fund'

export type Wallet = {
  accountNumber: string
  userId: number
  user?: User
} & TimeStamps

export type WalletTransaction = {
  amount: number
  currency: Currency
  reason: TransactionReason
  type: TransactionType
  walletId: number
  userId: number
  createdBy: number
  user?: User
  wallet?: Wallet
} & TimeStamps

export type BankDetails = { accountNumber: string; accountName: string }
