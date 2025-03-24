### Endpoint POST /hotel

## Input endpoint
{
  name: string
  address: {
    country: string
    state: string
    city: string
    district: string
    street: string
    number: number
    complement?: string
  }
}

## Output endpoint
{
  id: string
}


## Requisitos
⛔ Validar dados de entrada
⛔ Salvar os dados


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