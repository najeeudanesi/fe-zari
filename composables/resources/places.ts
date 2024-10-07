import { Entity } from './system'

export type Address = {
  id: number
  address: string
  longitude: number
  latitude: number
  refId: number
  entity: Entity
}
