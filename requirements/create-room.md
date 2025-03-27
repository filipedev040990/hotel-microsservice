### Endpoint POST /room

## Input endpoint
{
  number: number,
  type: string ('simple', 'suite),
  capacity: number,
  description: string,
  price: number
  status: string ("disponível", "ocupado", "reservado", "em manutenção"),
  amenities: string (ex: "Wi-Fi", "Ar-condicionado", "TV a cabo"),
  floor: number (andar em que está localizado),
  hotelId: string
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
  number: number,
  type: string ('simple', 'suite),
  capacity: number,
  description: string,
  price: number
  status: string ("disponível", "ocupado", "reservado", "em manutenção"),
  amenities: string (ex: "Wi-Fi", "Ar-condicionado", "TV a cabo"),
  floor: number (andar em que está localizado),
  hotelId: string
  createdAt: Date
  updatedAt: Date
}

✅Entity
⛔Usecase
⛔Controller
⛔Rota

✅⛔