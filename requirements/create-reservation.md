### Endpoint POST /reservation

## Input endpoint
{
  "hotelId": string,
  "roomId": string,
  "checkIn": string,
  "checkOut": string,
  "guestName": string,
  "guestEmail": string,
  "paymentDetails": {
    "total": number,
    "paymentMethod": string,
    "cardToken": string
  }
}


## Output endpoint
{
  "id": string,
  "hotelId": string,
  "roomId": string,
  "checkIn": string,
  "checkOut": "string,
  "guestName": string,
  "status": string,
  "paymentStatus": string
}


## Requisitos
✅ Validar dados de entrada
⛔ Publica pedido de reserva em uma fila para o pagamento ser processado
⛔ Retorna que a reserva será confirmada após confirmação do pagamento

✅ Entity
⛔ Usecase
⛔ Controller
⛔ Rota

✅⛔