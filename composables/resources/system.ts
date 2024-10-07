import dayjs from 'dayjs'
import { User } from './people'

export const formatDate = (date: string, format: 'l' | 's' | 'dt'| 'in') => {
  const formatMap = {
    l: LONG_DATE_FORMAT,
    s: SHORT_DATE_FORMAT,
    dt: DATE_TIME_FORMAT,
    in:   INPUT_DATE_FORMAT
  }
  return dayjs(date).format(formatMap[format])
}


export const formatNumberWithCommas = (input) => {
  let number;
  if (typeof input === 'string') {
      number = parseFloat(input);
      if (isNaN(number)) {
          return 'Invalid input, unable to convert string to number';
      }
  } else if (typeof input === 'number') {
      number = input;
  } else {
      return 'Invalid input, please provide a number or a numeric string';
  }
  let [integerPart, decimalPart] = number.toString().split('.');

  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart+".00";
}

export type Entity =
  | 'password'
  | 'users'
  | 'media'
  | 'roles'
  | 'stores'
  | 'permissions'
  | 'vouchers'
  | 'gifts'
  | 'purchases'
  | 'gift_reviews'
  | 'payments'
  | 'purchase_logs'

export type Currency = 'NGN'

export type Media = {
  id: number
  url: string
  file: {
    name: string
    url: string
    size: number
    extname: string
    mimeType: string
  }
  key: string
  refId: number
  entity: Entity
  createdBy: number
} & TimeStamps

export type TimeStamps = {
  createdAt: string
  updatedAt: string
}

export type ItemLog = {
  id: number
  comment: string
  createdBy: number
  creator?: User
} & TimeStamps

export const LONG_DATE_FORMAT = 'dddd, D MMMM YYYY'
export const SHORT_DATE_FORMAT = 'D-MMM-YYYY'
export const INPUT_DATE_FORMAT = 'YYYY-MM-D'
export const DATE_TIME_FORMAT = 'dddd, D MMMM YYYY hh:mm A'

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150'
