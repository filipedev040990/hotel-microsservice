export type BuildHotelEntityInput = {
  id?: string
  externalCode?: string
  name: string
  address: Address
  createdAt?: Date
  updatedAt?: Date
}

export type Address = {
  country: string
  state: string
  city: string
  district: string
  street: string
  number: number
  complement?: string
}
