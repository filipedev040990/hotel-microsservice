### Endpoint GET /hotel ou /hotel/:id

## Output endpoint
[{
  name: string
  address: {
    country: string
    state: string
    city: string
    district: string
    street: string
    number: number
    complement: string
  },
  rooms: [{
    externalCode: string
    number: number,
    type: string,
    capacity: number,
    description: string,
    price: number,
    status: string,
    amenities: string,
    floor: number
  }]
}]


## Requisitos
⛔ Listar os dados


## Input Banco de dados
{
  id: string
  externalCode: string
  name: string
  country: string
  state: string
  city: string
  district: string
  street: string
  number: number
  complement?: string
  createdAt: Date
  updatedAt: Date
}

⛔Usecase
⛔Controller
⛔Rota

✅⛔