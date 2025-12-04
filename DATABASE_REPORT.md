# RideShare Database Management System - Comprehensive Database Report

## Executive Summary

This is a **Database-Centric Web Application** designed for comprehensive management of a ride-sharing platform's MySQL database. The application serves as a powerful database explorer, CRUD interface, and analytics tool, with 90% of its functionality focused on database operations, schema management, and data analysis.

---

## 1. Database Architecture & Design

### 1.1 Database Platform

- **Database System**: MySQL 8.x
- **Hosting**: Aiven Cloud Platform (Cloud-hosted MySQL)
- **ORM**: Prisma Client (Type-safe database access)
- **Connection**: SSL-encrypted connection to cloud database
- **Schema Management**: Prisma Schema Definition Language

### 1.2 Database Schema Overview

The database implements a **relational model** for a ride-sharing platform with **10 tables** organized into:
- **4 Core Entity Tables**: user, driver, vehicle, ride
- **3 Transaction Tables**: payment, payment_method, rating
- **2 Specialized Tables**: card, cash (payment method subtypes)
- **2 Junction Tables**: books, driver_vehicle (many-to-many relationships)

**Total Records**: 269+ users, with proportional data across all tables

---

## 2. Detailed Database Schema

### 2.1 Core Entities

#### Table: `user`
**Purpose**: Stores customer/passenger information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| name | VARCHAR | NOT NULL | User's full name |
| email | VARCHAR | UNIQUE, NOT NULL | Email address (login credential) |
| password | VARCHAR | NOT NULL | Bcrypt hashed password |
| phone_number | VARCHAR | NULLABLE | Contact number |

**Relationships**:
- One-to-Many with `payment_method` (user can have multiple payment methods)
- One-to-Many with `rating` (user can rate multiple rides)
- Many-to-Many with `ride` through `books` (user can book multiple rides)

**Indexes**:
- Primary: user_id
- Unique: email

**Sample Query**:
```sql
SELECT * FROM user WHERE email = 'kevin@test.com';
```

---

#### Table: `driver`
**Purpose**: Stores driver information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| driver_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique driver identifier |
| name | VARCHAR | NOT NULL | Driver's full name |
| email | VARCHAR | UNIQUE, NOT NULL | Email address |
| phone_number | VARCHAR | NULLABLE | Contact number |

**Relationships**:
- One-to-Many with `ride` (driver can complete multiple rides)
- Many-to-Many with `vehicle` through `driver_vehicle` (driver can operate multiple vehicles)

**Business Logic**: Drivers are assigned to vehicles through the junction table, allowing flexible vehicle assignments.

---

#### Table: `vehicle`
**Purpose**: Stores vehicle inventory

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| vehicle_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique vehicle identifier |
| type | VARCHAR | NOT NULL | Vehicle type (sedan, SUV, etc.) |
| model | VARCHAR | NOT NULL | Vehicle model |
| license_plate_no | VARCHAR | UNIQUE, NOT NULL | License plate number |

**Relationships**:
- One-to-Many with `ride` (vehicle used in multiple rides)
- Many-to-Many with `driver` through `driver_vehicle`

**Constraints**: License plate must be unique (enforced at database level)

---

#### Table: `ride`
**Purpose**: Central table storing ride transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ride_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ride identifier |
| driver_id | INT | FOREIGN KEY, NULLABLE | Assigned driver |
| vehicle_id | INT | FOREIGN KEY, NULLABLE | Assigned vehicle |
| description | TEXT | NULLABLE | Ride description/notes |
| unit_price | DECIMAL(10,2) | NULLABLE | Base price per unit |
| date | DATETIME | NULLABLE | Ride date and time |
| status | VARCHAR | NULLABLE | Ride status (pending, completed, cancelled) |
| pickup | VARCHAR | NULLABLE | Pickup location |
| drop_location | VARCHAR | NULLABLE | Drop-off location |

**Relationships**:
- Many-to-One with `driver` (ON DELETE SET NULL, ON UPDATE CASCADE)
- Many-to-One with `vehicle` (ON DELETE SET NULL, ON UPDATE CASCADE)
- One-to-Many with `payment` (ride can have payment records)
- One-to-Many with `rating` (ride can be rated)
- Many-to-Many with `user` through `books`

**Referential Integrity**:
- If driver deleted → ride.driver_id set to NULL
- If vehicle deleted → ride.vehicle_id set to NULL
- Cascading updates on driver/vehicle changes

---

### 2.2 Payment System Tables

#### Table: `payment_method`
**Purpose**: Stores user payment method preferences

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| method_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique method identifier |
| method_type | VARCHAR | NOT NULL | Type: 'card' or 'cash' |
| user_id | INT | FOREIGN KEY, NOT NULL | Owner user |

**Relationships**:
- Many-to-One with `user` (ON DELETE CASCADE)
- One-to-One with `card` (optional, if method_type = 'card')
- One-to-One with `cash` (optional, if method_type = 'cash')
- One-to-Many with `payment` (method used in multiple payments)

**Design Pattern**: Uses **Table Per Type** inheritance pattern for payment methods

---

#### Table: `card`
**Purpose**: Stores credit/debit card details

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| card_no | VARCHAR | PRIMARY KEY | Card number (encrypted) |
| type | VARCHAR | NULLABLE | Card type (Visa, Mastercard) |
| expiry | DATETIME | NULLABLE | Expiration date |
| name | VARCHAR | NULLABLE | Cardholder name |
| method_id | INT | FOREIGN KEY, UNIQUE | Links to payment_method |

**Relationships**:
- One-to-One with `payment_method` (ON DELETE CASCADE)

**Security Note**: Card numbers should be encrypted/tokenized in production

---

#### Table: `cash`
**Purpose**: Represents cash payment method

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| cash_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique cash method ID |
| method_id | INT | FOREIGN KEY, UNIQUE | Links to payment_method |

**Relationships**:
- One-to-One with `payment_method` (ON DELETE CASCADE)

---

#### Table: `payment`
**Purpose**: Records actual payment transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| payment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique payment identifier |
| ride_id | INT | FOREIGN KEY, NOT NULL | Associated ride |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| status | VARCHAR | NULLABLE | Payment status |
| method_id | INT | FOREIGN KEY, NOT NULL | Payment method used |

**Relationships**:
- Many-to-One with `ride` (ON DELETE CASCADE)
- Many-to-One with `payment_method` (ON DELETE CASCADE)

**Business Rules**:
- Each payment must be linked to a ride
- Amount stored with 2 decimal precision
- Cascade delete: if ride deleted, payments deleted

---

### 2.3 Rating System

#### Table: `rating`
**Purpose**: Stores user ratings for completed rides

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rating_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique rating identifier |
| score | INT | NULLABLE | Rating score (1-5) |
| comments | TEXT | NULLABLE | User comments |
| created_at | DATETIME | DEFAULT NOW() | Rating timestamp |
| user_id | INT | FOREIGN KEY, NOT NULL | User who rated |
| ride_id | INT | FOREIGN KEY, NOT NULL | Rated ride |

**Relationships**:
- Many-to-One with `user` (ON DELETE CASCADE)
- Many-to-One with `ride` (ON DELETE CASCADE)

**Analytics Use**: Used for driver performance analysis

---

### 2.4 Junction Tables (Many-to-Many)

#### Table: `driver_vehicle`
**Purpose**: Links drivers to vehicles they can operate

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| driver_id | INT | FOREIGN KEY, COMPOSITE PK | Driver reference |
| vehicle_id | INT | FOREIGN KEY, COMPOSITE PK | Vehicle reference |

**Composite Primary Key**: (driver_id, vehicle_id)

**Relationships**:
- Many-to-One with `driver` (ON DELETE CASCADE)
- Many-to-One with `vehicle` (ON DELETE CASCADE)

**Business Logic**: Allows flexible driver-vehicle assignments

---

#### Table: `books`
**Purpose**: Links users to rides they've booked

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INT | FOREIGN KEY, COMPOSITE PK | User who booked |
| ride_id | INT | FOREIGN KEY, COMPOSITE PK | Booked ride |

**Composite Primary Key**: (user_id, ride_id)

**Relationships**:
- Many-to-One with `user` (ON DELETE CASCADE)
- Many-to-One with `ride` (ON DELETE CASCADE)

**Business Logic**: Tracks ride bookings, prevents duplicate bookings

---

## 3. Database Operations & CRUD Implementation

### 3.1 Schema Introspection

**Query Used**:
```sql
SELECT TABLE_NAME 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE();

SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME, ORDINAL_POSITION;
```

**Implementation**: `fetchDatabaseSchema()` in utility.repository.js
- Queries MySQL information_schema
- Returns table names and column metadata
- Used to populate UI dropdowns dynamically

---

### 3.2 Read Operations (SELECT)

**Basic Fetch**:
```javascript
const rows = await prisma[modelName].findMany({
  orderBy: { [getPrimaryKeyField(modelName)]: 'asc' }
});
```

**With Pagination** (Frontend):
```javascript
const startIndex = (currentPage - 1) * pageSize; // pageSize = 10
const endIndex = startIndex + pageSize;
const paginatedRows = tableData.rows.slice(startIndex, endIndex);
```

**Complex Queries** (Analytics):
```sql
SELECT d.name, d.email, AVG(r.score) as avg_score, COUNT(r.rating_id) as review_count
FROM driver d
JOIN ride ri ON d.driver_id = ri.driver_id
JOIN rating r ON ri.ride_id = r.ride_id
GROUP BY d.driver_id
ORDER BY avg_score DESC
LIMIT 5;
```

---

### 3.3 Create Operations (INSERT)

**Single Record Insert**:
```javascript
const newRecord = await prisma[modelName].create({
  data: data
});
```

**Complex Transaction** (Register Driver & Vehicle):
```javascript
await prisma.$transaction(async (tx) => {
  const driver = await tx.driver.create({ data: driverData });
  const vehicle = await tx.vehicle.create({ data: vehicleData });
  await tx.driver_vehicle.create({
    data: {
      driver_id: driver.driver_id,
      vehicle_id: vehicle.vehicle_id
    }
  });
});
```

**Features**:
- Atomic transactions ensure data consistency
- Auto-increment IDs handled by database
- Foreign key validation automatic

---

### 3.4 Update Operations (UPDATE)

```javascript
const updatedRecord = await prisma[modelName].update({
  where: { [primaryKey]: parseInt(id) },
  data: data
});
```

**Cascading Updates**: Defined in schema (ON UPDATE CASCADE)

---

### 3.5 Delete Operations (DELETE)

```javascript
await prisma[modelName].delete({
  where: { [primaryKey]: parseInt(id) }
});
```

**Cascade Behavior**:
- Delete user → deletes payment_methods, ratings, bookings
- Delete ride → deletes payments, ratings, bookings
- Delete driver → sets ride.driver_id to NULL, deletes driver_vehicle entries

---

## 4. Database Queries & Analytics

### 4.1 Budget Forecast Query

**Purpose**: Project future revenue based on historical payments

```javascript
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const payments = await prisma.payment.findMany({
  where: {
    ride: {
      date: { gte: oneYearAgo }
    }
  },
  include: { ride: true }
});

const baseAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
```

**Business Logic**: Calculates 3-year forecast with inflation rate

---

### 4.2 Top Drivers Analysis

**Raw SQL Query**:
```sql
SELECT d.name, d.email, AVG(r.score) as avg_score, COUNT(r.rating_id) as review_count
FROM driver d
JOIN ride ri ON d.driver_id = ri.driver_id
JOIN rating r ON ri.ride_id = r.ride_id
GROUP BY d.driver_id
ORDER BY avg_score DESC
LIMIT 5;
```

**Joins Used**:
- driver → ride (one-to-many)
- ride → rating (one-to-many)

**Aggregations**:
- AVG(score): Average rating
- COUNT(rating_id): Number of reviews

---

### 4.3 Custom Query Execution

**Security Implementation**:
```javascript
const trimmedQuery = query.trim().toUpperCase();

// Only allow SELECT
if (!trimmedQuery.startsWith('SELECT')) {
  return error('Only SELECT queries allowed');
}

// Block dangerous keywords
const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE'];
for (const keyword of dangerousKeywords) {
  if (trimmedQuery.includes(keyword)) {
    return error(`Forbidden keyword: ${keyword}`);
  }
}

// Execute safely
const results = await prisma.$queryRawUnsafe(query);
```

**Supported Queries**:
- SELECT with WHERE, JOIN, GROUP BY, ORDER BY, LIMIT
- Aggregate functions (COUNT, SUM, AVG, MIN, MAX)
- Subqueries
- Complex joins

**Example Queries**:
```sql
-- User bookings count
SELECT u.name, COUNT(b.ride_id) as total_bookings
FROM user u
LEFT JOIN books b ON u.user_id = b.user_id
GROUP BY u.user_id
ORDER BY total_bookings DESC;

-- Revenue by driver
SELECT d.name, SUM(p.amount) as total_revenue
FROM driver d
JOIN ride r ON d.driver_id = r.driver_id
JOIN payment p ON r.ride_id = p.ride_id
GROUP BY d.driver_id;
```

---

## 5. Database Indexing & Performance

### 5.1 Primary Keys (Clustered Indexes)

All tables have auto-increment primary keys:
- Ensures unique identification
- Optimizes JOIN operations
- Provides natural ordering

### 5.2 Unique Indexes

- `user.email`: Fast user lookup by email
- `driver.email`: Fast driver lookup
- `vehicle.license_plate_no`: Prevent duplicate vehicles
- `card.card_no`: Unique card identification

### 5.3 Foreign Key Indexes

Automatically created on:
- All foreign key columns for JOIN optimization
- Composite keys in junction tables

### 5.4 Query Optimization

**Pagination**:
- Limits data transfer (10 records/page)
- Reduces memory usage
- Improves response time

**Prisma Optimizations**:
- Connection pooling
- Prepared statements
- Query result caching

---

## 6. Data Integrity & Constraints

### 6.1 Entity Integrity

- **Primary Keys**: All tables have primary keys
- **Auto-increment**: Ensures unique IDs
- **NOT NULL**: Critical fields cannot be null

### 6.2 Referential Integrity

**Foreign Key Constraints**:
```prisma
ride.driver_id → driver.driver_id (ON DELETE SET NULL, ON UPDATE CASCADE)
payment.ride_id → ride.ride_id (ON DELETE CASCADE, ON UPDATE CASCADE)
rating.user_id → user.user_id (ON DELETE CASCADE, ON UPDATE CASCADE)
```

**Cascade Rules**:
- **CASCADE**: Delete/update propagates to child records
- **SET NULL**: Delete sets foreign key to NULL
- **RESTRICT**: Prevent delete if references exist (default)

### 6.3 Domain Integrity

- **Data Types**: Enforced at database level (INT, VARCHAR, DECIMAL, DATETIME)
- **Unique Constraints**: email, license_plate_no, card_no
- **Check Constraints**: Can be added for rating.score (1-5 range)

### 6.4 User-Defined Integrity

- **Password Hashing**: bcrypt with salt rounds
- **Email Validation**: Application-level validation
- **Business Rules**: Enforced in application logic

---

## 7. Database Security

### 7.1 Connection Security

- **SSL/TLS**: Encrypted connection to Aiven MySQL
- **Environment Variables**: Credentials stored in .env
- **Connection String**: `mysql://user:password@host:port/database?sslaccept=strict`

### 7.2 SQL Injection Prevention

**Prisma ORM Protection**:
```javascript
// Safe - Parameterized query
await prisma.user.findMany({
  where: { email: userInput }
});

// Unsafe - Only used for validated queries
await prisma.$queryRawUnsafe(validatedQuery);
```

**Custom Query Validation**:
- Whitelist approach (only SELECT)
- Keyword blacklist
- Input sanitization

### 7.3 Access Control

- **Authentication**: JWT tokens
- **Authorization**: Middleware on all routes
- **Row-Level Security**: Can be implemented with Prisma middleware

---

## 8. Database Monitoring & Maintenance

### 8.1 Prisma Studio

- **Port**: 5555
- **Features**: Visual database browser, CRUD operations
- **Usage**: Development and debugging

### 8.2 Application Logging

```javascript
console.log('Database Connected');
console.log('Users in database:', userCount);
```

### 8.3 Error Handling

```javascript
try {
  const result = await prisma.user.findMany();
} catch (error) {
  console.error('Database error:', error);
  // Graceful error handling
}
```

---

## 9. Database Backup & Recovery

### 9.1 Aiven Cloud Backups

- **Automatic Backups**: Daily backups by Aiven
- **Point-in-Time Recovery**: Available
- **Backup Retention**: Configurable

### 9.2 Export Capabilities

**SQL Dump**:
```bash
mysqldump -h host -u user -p database > backup.sql
```

**Application Export**: Can be implemented for CSV/JSON export

---

## 10. Database Statistics

### 10.1 Current Data Volume

- **Users**: 269 records
- **Drivers**: Proportional to users
- **Vehicles**: Multiple per driver
- **Rides**: Historical ride data
- **Payments**: One per ride
- **Ratings**: User feedback records

### 10.2 Growth Projections

Based on budget forecast analytics:
- 3-year revenue projection
- Configurable inflation rate
- Historical data analysis

---

## 11. Conclusion

This database-centric application demonstrates:

✅ **Robust Schema Design**: Normalized relational structure
✅ **Referential Integrity**: Proper foreign key relationships
✅ **ACID Compliance**: Transaction support via Prisma
✅ **Security**: SQL injection prevention, encrypted connections
✅ **Performance**: Indexing, pagination, query optimization
✅ **Scalability**: Cloud-hosted, connection pooling
✅ **Analytics**: Complex queries, aggregations, reporting
✅ **Maintainability**: Prisma ORM, schema migrations

The application serves as a comprehensive database management tool with 90% focus on database operations, making it an ideal solution for ride-sharing platform data management.

---

**Report Version**: 1.0  
**Database**: MySQL 8.x (Aiven Cloud)  
**ORM**: Prisma 5.0.0  
**Total Tables**: 10  
**Total Records**: 269+ users with related data
