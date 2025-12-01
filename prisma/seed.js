// prisma/seed.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Helper functions for generating random data
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDecimal(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2)
}

function getRandomFutureDate(daysFromNow = 30) {
  const date = new Date()
  date.setDate(date.getDate() + getRandomNumber(1, daysFromNow))
  date.setHours(getRandomNumber(8, 22), getRandomNumber(0, 59))
  return date
}

function getRandomPastDate(daysAgo = 30) {
  const date = new Date()
  date.setDate(date.getDate() - getRandomNumber(1, daysAgo))
  date.setHours(getRandomNumber(8, 22), getRandomNumber(0, 59))
  return date
}

async function main() {
  console.log('🌱 Starting seed with 30-50 rows per table...')

  // Clear existing data
  console.log('🗑️ Clearing existing data...')
  await prisma.books.deleteMany()
  await prisma.driver_vehicle.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.card.deleteMany()
  await prisma.cash.deleteMany()
  await prisma.payment_method.deleteMany()
  await prisma.ride.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.user.deleteMany()

  // Sample data arrays
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Emily', 'Kevin'
  ]

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson'
  ]

  const cities = {
    pickups: [
      '123 Main Street, Downtown',
      '456 Central Avenue, Midtown',
      '789 Park Road, Uptown',
      '321 Oak Street, Westside',
      '654 Pine Avenue, Eastside',
      '987 Elm Boulevard, North District',
      '147 Maple Drive, South Quarter',
      '258 Cedar Lane, Riverside'
    ],
    dropoffs: [
      'International Airport, Terminal A',
      'Grand Central Station',
      'Tech Park Campus',
      'University Main Campus',
      'Shopping Mall Complex',
      'Medical Center West Wing',
      'Business District Tower',
      'Convention Center Hall B'
    ]
  }

  const vehicleTypes = ['Sedan', 'SUV', 'Compact', 'Luxury', 'Electric']
  const vehicleModels = {
    'Sedan': ['Toyota Camry', 'Honda Accord', 'Hyundai Elantra', 'Ford Fusion'],
    'SUV': ['Honda CR-V', 'Toyota RAV4', 'Ford Explorer', 'Nissan Rogue'],
    'Compact': ['Ford Focus', 'Toyota Corolla', 'Honda Civic', 'Kia Forte'],
    'Luxury': ['BMW 5 Series', 'Mercedes E-Class', 'Audi A6', 'Lexus ES'],
    'Electric': ['Tesla Model 3', 'Tesla Model Y', 'Nissan Leaf', 'Chevy Bolt']
  }

  const rideDescriptions = [
    'Airport transfer service',
    'Business meeting commute',
    'Shopping center trip',
    'Dinner reservation transport',
    'Doctor appointment visit',
    'City tour for visitors',
    'Commute to work',
    'School pickup service',
    'Event transportation',
    'Quick errand run'
  ]

  // Create 35 Users
  console.log('👥 Creating 35 users...')
  const users = []
  for (let i = 0; i < 35; i++) {
    const firstName = getRandomElement(firstNames)
    const lastName = getRandomElement(lastNames)
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        phone_number: `+1-555-${String(1000 + i).padStart(4, '0')}`
      }
    })
    users.push(user)
  }

  // Create 20 Drivers
  console.log('🚗 Creating 20 drivers...')
  const drivers = []
  for (let i = 0; i < 20; i++) {
    const firstName = getRandomElement(firstNames)
    const lastName = getRandomElement(lastNames)
    const driver = await prisma.driver.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: `driver.${firstName.toLowerCase()}.${lastName.toLowerCase()}@rideshare.com`,
        phone_number: `+1-555-${String(2000 + i).padStart(4, '0')}`
      }
    })
    drivers.push(driver)
  }

  // Create 25 Vehicles
  console.log('🚙 Creating 25 vehicles...')
  const vehicles = []
  const usedLicensePlates = new Set()
  
  for (let i = 0; i < 25; i++) {
    let licensePlate
    do {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      const randomLetters = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('')
      const randomNumbers = Array.from({length: 3}, () => numbers[Math.floor(Math.random() * numbers.length)]).join('')
      licensePlate = `${randomLetters}${randomNumbers}`
    } while (usedLicensePlates.has(licensePlate))
    usedLicensePlates.add(licensePlate)

    const vehicleType = getRandomElement(vehicleTypes)
    const model = getRandomElement(vehicleModels[vehicleType])

    const vehicle = await prisma.vehicle.create({
      data: {
        type: vehicleType,
        model: model,
        license_plate_no: licensePlate
      }
    })
    vehicles.push(vehicle)
  }

  // Create Payment Methods (40 total)
  console.log('💳 Creating 40 payment methods...')
  const paymentMethods = []
  const cardTypes = ['Visa', 'Mastercard', 'American Express']
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    
    // Each user gets 1-2 payment methods
    const numMethods = getRandomNumber(1, 2)
    
    for (let j = 0; j < numMethods; j++) {
      if (j === 0 || Math.random() < 0.5) { // First method or 50% chance for second
        const isCard = Math.random() < 0.7 // 70% card, 30% cash
        
        if (isCard) {
          const cardMethod = await prisma.payment_method.create({
            data: {
              method_type: 'credit_card',
              user_id: user.user_id
            }
          })
          
          await prisma.card.create({
            data: {
              card_no: `4${String(i * 10 + j).padStart(15, '0')}`.replace(/(.{4})/g, '$1-').slice(0, -1),
              type: getRandomElement(cardTypes),
              expiry: new Date(`202${getRandomNumber(5, 7)}-${String(getRandomNumber(1, 12)).padStart(2, '0')}-28`),
              name: user.name,
              method_id: cardMethod.method_id
            }
          })
          
          paymentMethods.push(cardMethod)
        } else {
          const cashMethod = await prisma.payment_method.create({
            data: {
              method_type: 'cash',
              user_id: user.user_id
            }
          })
          
          await prisma.cash.create({
            data: {
              method_id: cashMethod.method_id
            }
          })
          
          paymentMethods.push(cashMethod)
        }
      }
    }
  }

  // Create 40 Rides
  console.log('🚖 Creating 40 rides...')
  const rides = []
  const rideStatuses = ['completed', 'completed', 'completed', 'in_progress', 'upcoming'] // Weighted towards completed
  
  for (let i = 0; i < 40; i++) {
    const status = getRandomElement(rideStatuses)
    const rideDate = status === 'upcoming' ? getRandomFutureDate(14) : 
                     status === 'in_progress' ? new Date() : 
                     getRandomPastDate(30)
    
    const ride = await prisma.ride.create({
      data: {
        driver_id: getRandomElement(drivers).driver_id,
        vehicle_id: getRandomElement(vehicles).vehicle_id,
        description: getRandomElement(rideDescriptions),
        unit_price: parseFloat(getRandomDecimal(12, 75)),
        date: rideDate,
        status: status,
        pickup: getRandomElement(cities.pickups),
        drop_location: getRandomElement(cities.dropoffs)
      }
    })
    rides.push(ride)
  }

  // Create 35 Payments
  console.log('💰 Creating 35 payments...')
  const paymentStatuses = ['completed', 'completed', 'completed', 'pending', 'failed']
  
  for (let i = 0; i < 35; i++) {
    const ride = getRandomElement(rides.filter(r => r.status === 'completed'))
    const user = getRandomElement(users)
    const userPaymentMethods = paymentMethods.filter(pm => pm.user_id === user.user_id)
    
    if (userPaymentMethods.length > 0) {
      await prisma.payment.create({
        data: {
          ride_id: ride.ride_id,
          amount: ride.unit_price || parseFloat(getRandomDecimal(12, 75)),
          status: getRandomElement(paymentStatuses),
          method_id: getRandomElement(userPaymentMethods).method_id
        }
      })
    }
  }

  // Create 30 Ratings
  console.log('⭐ Creating 30 ratings...')
  for (let i = 0; i < 30; i++) {
    const ride = getRandomElement(rides.filter(r => r.status === 'completed'))
    const user = getRandomElement(users)
    
    await prisma.rating.create({
      data: {
        score: getRandomNumber(3, 5), // Mostly positive ratings
        comments: getRandomElement([
          'Excellent service! Very professional driver.',
          'Great ride, clean car and smooth driving.',
          'Good experience overall.',
          'Driver was friendly and punctual.',
          'Comfortable ride, would recommend.',
          'Quick and efficient service.',
          'Polite driver and safe driving.',
          'Clean vehicle and good route.',
          'On time and professional.',
          'Good value for money.'
        ]),
        user_id: user.user_id,
        ride_id: ride.ride_id
      }
    })
  }

  // Create 30 Driver-Vehicle relationships
  console.log('🔗 Creating 30 driver-vehicle relationships...')
  const usedDriverVehiclePairs = new Set()
  
  for (let i = 0; i < 30; i++) {
    let driver, vehicle
    let pairKey
    
    do {
      driver = getRandomElement(drivers)
      vehicle = getRandomElement(vehicles)
      pairKey = `${driver.driver_id}-${vehicle.vehicle_id}`
    } while (usedDriverVehiclePairs.has(pairKey))
    
    usedDriverVehiclePairs.add(pairKey)
    
    await prisma.driver_vehicle.create({
      data: {
        driver_id: driver.driver_id,
        vehicle_id: vehicle.vehicle_id
      }
    })
  }

  // Create 35 Bookings
  console.log('📅 Creating 35 bookings...')
  const usedUserRidePairs = new Set()
  
  for (let i = 0; i < 35; i++) {
    let user, ride
    let pairKey
    
    do {
      user = getRandomElement(users)
      ride = getRandomElement(rides)
      pairKey = `${user.user_id}-${ride.ride_id}`
    } while (usedUserRidePairs.has(pairKey))
    
    usedUserRidePairs.add(pairKey)
    
    await prisma.books.create({
      data: {
        user_id: user.user_id,
        ride_id: ride.ride_id
      }
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log(`📊 Created:
    - ${users.length} users
    - ${drivers.length} drivers  
    - ${vehicles.length} vehicles
    - ${paymentMethods.length} payment methods
    - ${rides.length} rides
    - 35 payments
    - 30 ratings
    - 30 driver-vehicle relationships
    - 35 bookings`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })