### Endpoint PATCH /hotel

## Input endpoint
{
  name?: string
  address?: {
    country?: string
    state?: string
    city?: string
    district?: string
    street?: string
    number?: number
    complement?: string
  }
}

## Output endpoint
{
  id: string
  name: string
  address: {
    country: string
    state: string
    city: string
    district: string
    street: string
    number: number
    complement: string
  }
}


## Requisitos
⛔ Validar dados de entrada
⛔ Atualizar os dados


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

✅Entity
⛔Usecase
⛔Controller
⛔Rota

✅⛔