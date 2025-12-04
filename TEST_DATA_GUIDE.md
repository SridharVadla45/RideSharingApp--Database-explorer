# Complete Test Data for All Tables - Data Integrity Compliant

## Test Data Generation Guide
**Follow this exact order to maintain referential integrity**

---

## Order of Operations (CRITICAL!)

**Must follow this sequence:**
1. User (no dependencies)
2. Driver (no dependencies)
3. Vehicle (no dependencies)
4. Payment Method (depends on User)
5. Card OR Cash (depends on Payment Method)
6. Ride (depends on Driver, Vehicle)
7. Books (depends on User, Ride)
8. Driver-Vehicle (depends on Driver, Vehicle)
9. Payment (depends on Ride, Payment Method)
10. Rating (depends on User, Ride)

---

## Test Data Set 1: Complete User Journey

### Step 1: Add User
**Table**: `user`
```
name: Alice Johnson
email: alice.test@example.com
password: password123
phone_number: +1-555-0101
```
**Expected**: user_id = 300 (or next available)

---

### Step 2: Add Driver
**Table**: `driver`
```
name: Bob Smith
email: bob.driver@example.com
phone_number: +1-555-0201
```
**Expected**: driver_id = 200 (or next available)

---

### Step 3: Add Vehicle
**Table**: `vehicle`
```
type: Sedan
model: Toyota Camry 2024
license_plate_no: TEST-ABC-123
```
**Expected**: vehicle_id = 150 (or next available)

---

### Step 4: Add Payment Method (Card)
**Table**: `payment_method`
```
method_type: card
user_id: 300 (select Alice Johnson from dropdown)
```
**Expected**: method_id = 3001 (or next available)

---

### Step 5: Add Card Details
**Table**: `card`
```
card_no: 4111111111111111
type: Visa
expiry: 2029-12-31T00:00
name: Alice Johnson
method_id: 3001 (select the one just created)
```
**Expected**: Success! One-to-one relationship with payment_method

---

### Step 6: Link Driver to Vehicle
**Table**: `driver_vehicle`
```
driver_id: 200 (select Bob Smith)
vehicle_id: 150 (select Toyota Camry)
```
**Expected**: Success! Many-to-many relationship

---

### Step 7: Create Ride
**Table**: `ride`
```
driver_id: 200 (select Bob Smith)
vehicle_id: 150 (select Toyota Camry)
description: Airport pickup
unit_price: 45.50
date: 2025-12-04T10:00
status: completed
pickup: Downtown Hotel
drop_location: International Airport
```
**Expected**: ride_id = 500 (or next available)

---

### Step 8: User Books Ride
**Table**: `books`
```
user_id: 300 (select Alice Johnson)
ride_id: 500 (select the ride just created)
```
**Expected**: Success! Many-to-many relationship

---

### Step 9: Process Payment
**Table**: `payment`
```
ride_id: 500 (select the ride)
amount: 45.50
status: completed
method_id: 3001 (select Alice's card payment method)
```
**Expected**: payment_id = 4001 (or next available)

---

### Step 10: Add Rating
**Table**: `rating`
```
score: 5
comments: Excellent service! Very professional driver.
created_at: (leave default or set current time)
user_id: 300 (select Alice Johnson)
ride_id: 500 (select the ride)
```
**Expected**: rating_id = 5001 (or next available)

---

## Test Data Set 2: Cash Payment User

### Step 1: Add User
**Table**: `user`
```
name: Charlie Brown
email: charlie.test@example.com
password: password123
phone_number: +1-555-0102
```
**Expected**: user_id = 301

---

### Step 2: Add Payment Method (Cash)
**Table**: `payment_method`
```
method_type: cash
user_id: 301 (select Charlie Brown)
```
**Expected**: method_id = 3002

---

### Step 3: Add Cash Record
**Table**: `cash`
```
method_id: 3002 (select the cash payment method just created)
```
**Expected**: cash_id = auto-generated

---

### Step 4: Create Ride (Reuse existing driver/vehicle)
**Table**: `ride`
```
driver_id: 200 (select Bob Smith)
vehicle_id: 150 (select Toyota Camry)
description: City tour
unit_price: 35.00
date: 2025-12-04T14:00
status: completed
pickup: City Center
drop_location: Shopping Mall
```
**Expected**: ride_id = 501

---

### Step 5: User Books Ride
**Table**: `books`
```
user_id: 301 (select Charlie Brown)
ride_id: 501
```
**Expected**: Success!

---

### Step 6: Process Cash Payment
**Table**: `payment`
```
ride_id: 501
amount: 35.00
status: completed
method_id: 3002 (select Charlie's cash payment method)
```
**Expected**: payment_id = 4002

---

### Step 7: Add Rating
**Table**: `rating`
```
score: 4
comments: Good ride, but traffic was heavy
user_id: 301 (select Charlie Brown)
ride_id: 501
```
**Expected**: rating_id = 5002

---

## Test Data Set 3: Multiple Payment Methods

### Step 1: Add User
**Table**: `user`
```
name: Diana Prince
email: diana.test@example.com
password: password123
phone_number: +1-555-0103
```
**Expected**: user_id = 302

---

### Step 2: Add First Payment Method (Card)
**Table**: `payment_method`
```
method_type: card
user_id: 302 (select Diana Prince)
```
**Expected**: method_id = 3003

---

### Step 3: Add Card
**Table**: `card`
```
card_no: 5500000000000004
type: Mastercard
expiry: 2028-06-30T00:00
name: Diana Prince
method_id: 3003
```
**Expected**: Success!

---

### Step 4: Add Second Payment Method (Cash)
**Table**: `payment_method`
```
method_type: cash
user_id: 302 (select Diana Prince - same user!)
```
**Expected**: method_id = 3004
**Demonstrates**: One user can have multiple payment methods (1:N)

---

### Step 5: Add Cash Record
**Table**: `cash`
```
method_id: 3004
```
**Expected**: cash_id = auto-generated

---

## Test Data Set 4: Shared Ride (Multiple Users)

### Step 1: Create Ride
**Table**: `ride`
```
driver_id: 200 (select Bob Smith)
vehicle_id: 150 (select Toyota Camry)
description: Shared ride to airport
unit_price: 25.00
date: 2025-12-04T16:00
status: completed
pickup: Downtown
drop_location: Airport
```
**Expected**: ride_id = 502

---

### Step 2: First User Books
**Table**: `books`
```
user_id: 300 (select Alice Johnson)
ride_id: 502
```
**Expected**: Success!

---

### Step 3: Second User Books Same Ride
**Table**: `books`
```
user_id: 301 (select Charlie Brown)
ride_id: 502 (same ride!)
```
**Expected**: Success!
**Demonstrates**: Many-to-many relationship - multiple users can book same ride

---

### Step 4: First User Pays
**Table**: `payment`
```
ride_id: 502
amount: 25.00
status: completed
method_id: 3001 (Alice's card)
```
**Expected**: payment_id = 4003

---

### Step 5: Second User Pays
**Table**: `payment`
```
ride_id: 502 (same ride!)
amount: 25.00
status: completed
method_id: 3002 (Charlie's cash)
```
**Expected**: payment_id = 4004
**Demonstrates**: One ride can have multiple payments (1:N)

---

## Test Data Set 5: Driver with Multiple Vehicles

### Step 1: Add Second Vehicle
**Table**: `vehicle`
```
type: SUV
model: Honda CR-V 2024
license_plate_no: TEST-XYZ-789
```
**Expected**: vehicle_id = 151

---

### Step 2: Link Same Driver to Second Vehicle
**Table**: `driver_vehicle`
```
driver_id: 200 (select Bob Smith - same driver!)
vehicle_id: 151 (select Honda CR-V)
```
**Expected**: Success!
**Demonstrates**: One driver can operate multiple vehicles (M:N)

---

### Step 3: Create Ride with Second Vehicle
**Table**: `ride`
```
driver_id: 200 (select Bob Smith)
vehicle_id: 151 (select Honda CR-V - different vehicle!)
description: Family trip
unit_price: 55.00
date: 2025-12-04T18:00
status: completed
pickup: Residential Area
drop_location: Theme Park
```
**Expected**: ride_id = 503

---

## Test Data Set 6: Pending Ride (Optional Relationships)

### Step 1: Create Ride Without Driver
**Table**: `ride`
```
driver_id: (leave empty - optional!)
vehicle_id: (leave empty - optional!)
description: Ride request pending assignment
unit_price: 30.00
date: 2025-12-05T09:00
status: pending
pickup: Office Building
drop_location: Train Station
```
**Expected**: ride_id = 504
**Demonstrates**: Optional relationships - ride can exist without driver/vehicle

---

## Test Data Set 7: Multiple Ratings for Same Ride

### Step 1: First Rating
**Table**: `rating`
```
score: 5
comments: Amazing driver!
user_id: 300 (Alice)
ride_id: 502 (shared ride)
```
**Expected**: rating_id = 5003

---

### Step 2: Second Rating for Same Ride
**Table**: `rating`
```
score: 4
comments: Good experience
user_id: 301 (Charlie)
ride_id: 502 (same shared ride!)
```
**Expected**: rating_id = 5004
**Demonstrates**: One ride can have multiple ratings (1:N)

---

## Verification Queries

After adding all test data, verify using Data Browser:

### 1. Check User with Multiple Payment Methods
**Table**: `payment_method`
**Filter**: user_id = 302 (Diana)
**Expected**: 2 records (card and cash)

### 2. Check Shared Ride
**Table**: `books`
**Filter**: ride_id = 502
**Expected**: 2 records (Alice and Charlie)

### 3. Check Driver with Multiple Vehicles
**Table**: `driver_vehicle`
**Filter**: driver_id = 200 (Bob)
**Expected**: 2 records (Camry and CR-V)

### 4. Check Ride with Multiple Payments
**Table**: `payment`
**Filter**: ride_id = 502
**Expected**: 2 records (Alice's card, Charlie's cash)

### 5. Check Ride with Multiple Ratings
**Table**: `rating`
**Filter**: ride_id = 502
**Expected**: 2 records (from Alice and Charlie)

---

## Common Errors and Solutions

### Error 1: "Foreign key constraint failed"
**Cause**: Trying to reference non-existent record
**Solution**: Make sure parent record exists first
**Example**: Create user BEFORE creating payment_method

### Error 2: "Unique constraint failed on email"
**Cause**: Email already exists
**Solution**: Use different email address

### Error 3: "Unique constraint failed on card_method_id_key"
**Cause**: Payment method already has a card
**Solution**: Create new payment_method first, then add card

### Error 4: "Unique constraint failed on license_plate_no"
**Cause**: License plate already exists
**Solution**: Use different license plate number

### Error 5: "Duplicate entry for primary key"
**Cause**: Trying to add same booking twice
**Solution**: Use different user_id or ride_id combination

---

## Summary of Test Data Created

| Table | Records | Demonstrates |
|-------|---------|--------------|
| user | 3 | Basic entity |
| driver | 1 | Basic entity |
| vehicle | 2 | Basic entity |
| payment_method | 4 | 1:N (user has multiple methods) |
| card | 2 | 1:0..1 (one method, one card) |
| cash | 2 | 1:0..1 (one method, one cash) |
| ride | 5 | Optional relationships, multiple drivers |
| books | 4 | M:N (shared rides) |
| driver_vehicle | 2 | M:N (driver operates multiple vehicles) |
| payment | 4 | 1:N (ride has multiple payments) |
| rating | 4 | 1:N (ride has multiple ratings) |

**Total Records**: 33 test records across all tables

---

## Quick Test Checklist

- [ ] User created successfully
- [ ] Driver created successfully
- [ ] Vehicle created successfully
- [ ] Payment method (card) created
- [ ] Card details added
- [ ] Payment method (cash) created
- [ ] Cash record added
- [ ] Driver-vehicle link created
- [ ] Ride created with driver and vehicle
- [ ] User booked ride
- [ ] Payment processed
- [ ] Rating added
- [ ] Shared ride with multiple users tested
- [ ] Multiple payment methods for one user tested
- [ ] Multiple vehicles for one driver tested
- [ ] Pending ride without driver tested
- [ ] All foreign key dropdowns working
- [ ] All data integrity constraints enforced

---

**This test data covers ALL cardinality types and data integrity rules! 🎯**
