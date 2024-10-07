import { Money } from './resources/finance'

const style = 'currency'

export const getCurrencySymbol = (currency: Money['currency']) => {
  return (
    new Intl.NumberFormat('en-NG', { style, currency })
      .formatToParts(0)
      .find(({ type }) => type === 'currency')?.value || ''
  )
}

export const toMoney = (money: Money) =>
  new Intl.NumberFormat('en-NG', { style, currency: money.currency }).format(
    money.amount
  )
