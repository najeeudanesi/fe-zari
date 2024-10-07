import { Store } from './business'
import { Entity, Media, TimeStamps } from './system'

export type AccountStatus = 'active' | 'suspended' | 'pending'

export type Permission = {
  id: number
  code: string
  entity: Entity
}

export type RoleGroup = 'admin' | 'vendor' | 'user' | 'bot'

export type Role = {
  id: number
  alias: string
  name: string
  group: RoleGroup
  active: boolean
  createdBy: number
  permissions: Permission[]
}

export type User = {
  id: number
  name: string
  email: string
  phone: string
  username: string
  status: AccountStatus
  avatar?: Media
  roles?: Role[]
  stores?: Store[]
} & TimeStamps

export type UserRequest = {
  name: string
  email?: string
  phone?: string
  username: string
  password?: string
  roleGroup: RoleGroup
  storeId?: number
}
