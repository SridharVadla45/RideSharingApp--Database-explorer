# Database Cardinality Demo Guide

## Complete Guide to Demonstrating All Relationship Types

This guide provides step-by-step examples for demonstrating every cardinality relationship in the RideShare database.

---

## 1. One-to-Many Relationships

### 1.1 User → Payment Methods (1:N)
**Cardinality**: One user can have multiple payment methods

**Demo Steps:**
1. **View existing user:**
   - Go to Data Browser → Select `user` → Load Data
   - Note user_id = 1 (John Doe)

2. **Add first payment method:**
   - Go to Add Records → Select `payment_method`
   - Generate Form
   - Fill in:
     - `method_type`: card
     - `user_id`: 1 (select John Doe from dropdown)
   - Submit → Success! (method_id = 1001)

3. **Add second payment method for same user:**
   - Same steps as above
   - Fill in:
     - `method_type`: cash
     - `user_id`: 1 (same user)
   - Submit → Success! (method_id = 1002)

4. **Verify One-to-Many:**
   - Go to Data Browser → Select `payment_method` → Load Data
   - See multiple records with user_id = 1
   - **Result**: One user (ID: 1) has multiple payment methods ✅

---

### 1.2 Driver → Rides (1:N)
**Cardinality**: One driver can complete multiple rides

**Demo Steps:**
1. **View existing driver:**
   - Data Browser → `driver` → Load Data
   - Note driver_id = 1

2. **Add first ride:**
   - Add Records → `ride` → Generate Form
   - Fill in:
     - `driver_id`: 1 (from dropdown)
     - `vehicle_id`: 1 (from dropdown)
     - `unit_price`: 25.50
     - `date`: 2025-12-04T10:00
     - `status`: completed
     - `pickup`: Downtown
     - `drop_location`: Airport
   - Submit → Success!

3. **Add second ride for same driver:**
   - Same steps, different details
   - `driver_id`: 1 (same driver)
   - Different pickup/drop locations
   - Submit → Success!

4. **Verify:**
   - Data Browser → `ride` → Load Data
   - Filter or scroll to see multiple rides with driver_id = 1
   - **Result**: One driver completed multiple rides ✅

---

### 1.3 Ride → Payments (1:N)
**Cardinality**: One ride can have multiple payment records (e.g., split payment)

**Demo Steps:**
1. **View existing ride:**
   - Data Browser → `ride` → Load Data
   - Note ride_id = 100

2. **Add first payment:**
   - Add Records → `payment` → Generate Form
   - Fill in:
     - `ride_id`: 100 (from dropdown)
     - `amount`: 15.00
     - `status`: completed
     - `method_id`: 1 (from dropdown)
   - Submit → Success!

3. **Add second payment for same ride:**
   - Same ride_id = 100
   - `amount`: 10.50 (remaining amount)
   - Different method_id
   - Submit → Success!

4. **Verify:**
   - Data Browser → `payment` → Load Data
   - See multiple payments for ride_id = 100
   - **Result**: One ride has multiple payments (split payment) ✅

---

### 1.4 Ride → Ratings (1:N)
**Cardinality**: One ride can have multiple ratings (from different users if shared ride)

**Demo Steps:**
1. **Add first rating:**
   - Add Records → `rating` → Generate Form
   - Fill in:
     - `score`: 5
     - `comments`: Excellent service!
     - `user_id`: 1 (from dropdown)
     - `ride_id`: 100 (from dropdown)
   - Submit → Success!

2. **Add second rating for same ride:**
   - Different user_id
   - `ride_id`: 100 (same ride)
   - Submit → Success!

3. **Verify:**
   - Data Browser → `rating` → Load Data
   - Multiple ratings for ride_id = 100
   - **Result**: One ride has multiple ratings ✅

---

## 2. One-to-One Relationships

### 2.1 Payment Method → Card (1:0..1)
**Cardinality**: One payment method can have at most one card

**Demo Steps:**
1. **Create payment method first:**
   - Add Records → `payment_method`
   - Fill in:
     - `method_type`: card
     - `user_id`: 1
   - Submit → Note the method_id (e.g., 2001)

2. **Add card for this payment method:**
   - Add Records → `card` → Generate Form
   - Fill in:
     - `card_no`: 4111-1111-1111-1111
     - `type`: Visa
     - `expiry`: 2029-12-31T00:00
     - `name`: John Doe
     - `method_id`: 2001 (from dropdown - the one we just created)
   - Submit → Success!

3. **Try to add another card with same method_id:**
   - Same method_id = 2001
   - Different card_no
   - Submit → **ERROR: Unique constraint failed** ❌
   - **Result**: One payment method can have only ONE card ✅

4. **Verify One-to-One:**
   - Data Browser → `card` → Load Data
   - Each method_id appears only once
   - **Result**: One-to-one relationship enforced ✅

---

### 2.2 Payment Method → Cash (1:0..1)
**Cardinality**: One payment method can have at most one cash record

**Demo Steps:**
1. **Create payment method:**
   - Add Records → `payment_method`
   - Fill in:
     - `method_type`: cash
     - `user_id`: 2
   - Submit → Note method_id (e.g., 2002)

2. **Add cash record:**
   - Add Records → `cash` → Generate Form
   - Fill in:
     - `method_id`: 2002 (from dropdown)
   - Submit → Success!

3. **Try to add another cash with same method_id:**
   - Same method_id = 2002
   - Submit → **ERROR: Unique constraint failed** ❌
   - **Result**: One payment method can have only ONE cash record ✅

---

## 3. Many-to-Many Relationships

### 3.1 User ↔ Ride (through `books`)
**Cardinality**: Many users can book many rides

**Demo Steps:**
1. **User 1 books Ride 100:**
   - Add Records → `books` → Generate Form
   - Fill in:
     - `user_id`: 1 (from dropdown - John Doe)
     - `ride_id`: 100 (from dropdown)
   - Submit → Success!

2. **User 1 books Ride 101:**
   - Same user_id = 1
   - Different ride_id = 101
   - Submit → Success!
   - **Result**: One user booked multiple rides ✅

3. **User 2 books Ride 100:**
   - Different user_id = 2
   - Same ride_id = 100
   - Submit → Success!
   - **Result**: Multiple users booked same ride (shared ride) ✅

4. **Verify Many-to-Many:**
   - Data Browser → `books` → Load Data
   - See:
     - (user_id: 1, ride_id: 100)
     - (user_id: 1, ride_id: 101)
     - (user_id: 2, ride_id: 100)
   - **Result**: Many-to-many relationship working ✅

5. **Try duplicate booking:**
   - user_id: 1, ride_id: 100 (already exists)
   - Submit → **ERROR: Duplicate entry** ❌
   - **Result**: Composite primary key prevents duplicates ✅

---

### 3.2 Driver ↔ Vehicle (through `driver_vehicle`)
**Cardinality**: Many drivers can operate many vehicles

**Demo Steps:**
1. **Driver 1 operates Vehicle 1:**
   - Add Records → `driver_vehicle` → Generate Form
   - Fill in:
     - `driver_id`: 1 (from dropdown)
     - `vehicle_id`: 1 (from dropdown)
   - Submit → Success!

2. **Driver 1 operates Vehicle 2:**
   - Same driver_id = 1
   - Different vehicle_id = 2
   - Submit → Success!
   - **Result**: One driver can operate multiple vehicles ✅

3. **Driver 2 operates Vehicle 1:**
   - Different driver_id = 2
   - Same vehicle_id = 1
   - Submit → Success!
   - **Result**: Multiple drivers can operate same vehicle ✅

4. **Verify Many-to-Many:**
   - Data Browser → `driver_vehicle` → Load Data
   - See:
     - (driver_id: 1, vehicle_id: 1)
     - (driver_id: 1, vehicle_id: 2)
     - (driver_id: 2, vehicle_id: 1)
   - **Result**: Many-to-many relationship working ✅

---

## 4. Optional vs Required Relationships

### 4.1 Optional: Ride → Driver (0..1:N)
**Cardinality**: Ride can exist without a driver (pending assignment)

**Demo Steps:**
1. **Create ride without driver:**
   - Add Records → `ride` → Generate Form
   - Fill in:
     - `driver_id`: Leave empty (optional)
     - `vehicle_id`: Leave empty (optional)
     - `unit_price`: 30.00
     - `status`: pending
     - `pickup`: City Center
     - `drop_location`: Suburb
   - Submit → Success!
   - **Result**: Ride created without driver ✅

2. **Verify:**
   - Data Browser → `ride` → Load Data
   - See ride with NULL driver_id
   - **Result**: Optional relationship working ✅

---

### 4.2 Required: Payment → Ride (1:N)
**Cardinality**: Payment MUST have a ride (required)

**Demo Steps:**
1. **Try to create payment without ride:**
   - Add Records → `payment` → Generate Form
   - Leave `ride_id` empty
   - Submit → **ERROR: Required field** ❌
   - **Result**: Required relationship enforced ✅

2. **Create payment with ride:**
   - Fill in `ride_id`: 100
   - Submit → Success!
   - **Result**: Required relationship working ✅

---

## 5. Cascade Delete Demonstration

### 5.1 Delete User → Cascade to Payment Methods
**Behavior**: ON DELETE CASCADE

**Demo Steps:**
1. **Create test user:**
   - Add Records → `user`
   - name: Test User, email: test@delete.com
   - Note user_id (e.g., 9999)

2. **Add payment method for this user:**
   - Add Records → `payment_method`
   - user_id: 9999
   - Note method_id (e.g., 9001)

3. **Delete user:**
   - Use Prisma Studio or custom delete
   - Delete user with user_id = 9999

4. **Verify cascade:**
   - Data Browser → `payment_method` → Load Data
   - method_id 9001 is also deleted
   - **Result**: CASCADE delete working ✅

---

### 5.2 Delete Driver → SET NULL on Rides
**Behavior**: ON DELETE SET NULL

**Demo Steps:**
1. **Create test driver:**
   - Add Records → `driver`
   - Note driver_id (e.g., 9998)

2. **Create ride with this driver:**
   - Add Records → `ride`
   - driver_id: 9998
   - Note ride_id (e.g., 9100)

3. **Delete driver:**
   - Delete driver with driver_id = 9998

4. **Verify SET NULL:**
   - Data Browser → `ride` → Load Data
   - ride_id 9100 still exists
   - driver_id is now NULL
   - **Result**: SET NULL working ✅

---

## 6. Referential Integrity Violations

### 6.1 Invalid Foreign Key
**Demo:**
1. **Try to add payment with non-existent ride:**
   - Add Records → `payment`
   - ride_id: 99999 (doesn't exist)
   - Submit → **ERROR: Foreign key constraint failed** ❌
   - **Result**: Referential integrity enforced ✅

### 6.2 Unique Constraint
**Demo:**
1. **Try to add user with duplicate email:**
   - Add Records → `user`
   - email: kevin@test.com (already exists)
   - Submit → **ERROR: Unique constraint failed** ❌
   - **Result**: Unique constraint enforced ✅

---

## 7. Complete Demo Scenario

### Scenario: Complete Ride Lifecycle

**Step 1: Create User**
- Add user: Alice (alice@example.com)
- user_id = 300

**Step 2: Add Payment Method**
- Add payment_method: card, user_id = 300
- method_id = 3001

**Step 3: Add Card Details**
- Add card: card_no = 4532-1234-5678-9010, method_id = 3001

**Step 4: Create Driver & Vehicle**
- Add driver: Bob (bob@driver.com), driver_id = 200
- Add vehicle: Toyota Camry, license = ABC123, vehicle_id = 150

**Step 5: Assign Driver to Vehicle**
- Add driver_vehicle: driver_id = 200, vehicle_id = 150

**Step 6: Create Ride**
- Add ride: driver_id = 200, vehicle_id = 150, unit_price = 45.00
- ride_id = 500

**Step 7: User Books Ride**
- Add books: user_id = 300, ride_id = 500

**Step 8: Process Payment**
- Add payment: ride_id = 500, amount = 45.00, method_id = 3001

**Step 9: Add Rating**
- Add rating: user_id = 300, ride_id = 500, score = 5, comments = "Great ride!"

**Verify Complete Relationships:**
```
User (300) 
  → has payment_method (3001)
      → has card (4532-1234-5678-9010)
  → booked ride (500)
      → driven by driver (200)
          → using vehicle (150)
      → paid via payment (method 3001)
      → rated with rating (score 5)
```

---

## 8. Analytics Queries to Demonstrate Cardinality

### Query 1: Users with Multiple Payment Methods
```sql
SELECT u.name, COUNT(pm.method_id) as payment_methods_count
FROM user u
LEFT JOIN payment_method pm ON u.user_id = pm.user_id
GROUP BY u.user_id
HAVING payment_methods_count > 1;
```

### Query 2: Rides with Multiple Bookings (Shared Rides)
```sql
SELECT r.ride_id, COUNT(b.user_id) as passengers
FROM ride r
LEFT JOIN books b ON r.ride_id = b.ride_id
GROUP BY r.ride_id
HAVING passengers > 1;
```

### Query 3: Drivers Operating Multiple Vehicles
```sql
SELECT d.name, COUNT(dv.vehicle_id) as vehicles_count
FROM driver d
LEFT JOIN driver_vehicle dv ON d.driver_id = dv.driver_id
GROUP BY d.driver_id
HAVING vehicles_count > 1;
```

---

## Summary of All Cardinalities

| Relationship | Cardinality | Type | Cascade Behavior |
|--------------|-------------|------|------------------|
| User → Payment Method | 1:N | One-to-Many | CASCADE |
| User → Rating | 1:N | One-to-Many | CASCADE |
| Driver → Ride | 1:N | One-to-Many | SET NULL |
| Vehicle → Ride | 1:N | One-to-Many | SET NULL |
| Ride → Payment | 1:N | One-to-Many | CASCADE |
| Ride → Rating | 1:N | One-to-Many | CASCADE |
| Payment Method → Payment | 1:N | One-to-Many | CASCADE |
| Payment Method → Card | 1:0..1 | One-to-One | CASCADE |
| Payment Method → Cash | 1:0..1 | One-to-One | CASCADE |
| User ↔ Ride | M:N | Many-to-Many | CASCADE (via books) |
| Driver ↔ Vehicle | M:N | Many-to-Many | CASCADE (via driver_vehicle) |

---

## Presentation Tips

1. **Start Simple**: Begin with one-to-many (easiest to understand)
2. **Show Violations**: Demonstrate what happens when constraints are violated
3. **Use Real Data**: Use meaningful names and realistic values
4. **Verify Each Step**: Always check Data Browser after each operation
5. **Show Analytics**: Use custom queries to demonstrate relationships
6. **Explain Errors**: When errors occur, explain why (it's good!)
7. **Complete Scenario**: End with a full lifecycle demo

---

**This guide demonstrates ALL cardinality types in your database! 🎯**
