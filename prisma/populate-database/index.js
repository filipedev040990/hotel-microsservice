const axios = require('axios')
const { faker } = require('@faker-js/faker')

const BASE_URL = 'http://localhost:8000/v1/hotel'
const BASE_URL_ROOM = 'http://localhost:8000/v1/room'
const HEADERS = { 'X-Hotel-Admin': 'HiKi4tiyBRpwrg0Ohp2naBHCSsSCEXE1' }

async function createHotel () {
  const hotelData = {
    name: `Hotel ${faker.location.city()}`,
    address: {
      country: faker.location.country(),
      state: faker.location.state({ abbreviated: true }),
      city: faker.location.city(),
      district: faker.location.county(),
      street: faker.location.street(),
      number: faker.number.int({ min: 1, max: 9999 })
    }
  }

  try {
    const response = await axios.post(BASE_URL, hotelData, { headers: HEADERS })
    return response.data.id
  } catch (error) {
    console.error('Erro ao criar hotel:', error.response?.data || error.message)
    return null
  }
}

async function createRoom (hotelId, usedRoomNumbers) {
  let roomNumber

  // Garantir que o número do quarto seja único para o hotel
  do {
    roomNumber = faker.number.int({ min: 1, max: 500 })
  } while (usedRoomNumbers.has(roomNumber)) // Verifica se o número já foi usado

  // Adiciona o número do quarto ao conjunto de números usados
  usedRoomNumbers.add(roomNumber)

  const roomData = {
    number: roomNumber,
    description: `Quarto ${faker.commerce.productDescription()}`,
    type: faker.helpers.arrayElement(['simple', 'suite']),
    capacity: faker.number.int({ min: 1, max: 5 }),
    amenities: faker.lorem.words(5),
    floor: faker.number.int({ min: 1, max: 10 }),
    price: faker.number.int({ min: 5000, max: 50000 }),
    hotelId
  }

  try {
    await axios.post(BASE_URL_ROOM, roomData, { headers: HEADERS })
    console.log(`Quarto ${roomNumber} criado para hotel ${hotelId}`)
  } catch (error) {
    console.error(`Erro ao criar quarto ${roomNumber} para hotel ${hotelId}:`, error.response?.data || error.message)
  }
}

async function populateDatabase () {
  for (let i = 0; i < 500; i++) {
    const hotelId = await createHotel()
    if (hotelId) {
      const usedRoomNumbers = new Set() // Conjunto para armazenar números de quartos já criados para este hotel

      // Criar 10 quartos para cada hotel, garantindo números únicos
      for (let j = 0; j < 10; j++) {
        await createRoom(hotelId, usedRoomNumbers)
      }
    }
  }
  console.log('População de dados finalizada!')
}

populateDatabase()
