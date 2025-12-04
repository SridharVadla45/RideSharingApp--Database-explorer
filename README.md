# RideShare Admin Management Portal

A comprehensive admin dashboard for managing a ride-sharing platform database. Built with Express.js, Prisma ORM, and MySQL.

## 📋 Project Overview

This is a professional database management system designed for administrators to manage all aspects of a ride-sharing platform including users, drivers, vehicles, rides, payments, and ratings.

### Key Features

- **🗄️ Data Browser** - View and explore all database tables
- **➕ Add Records** - Create new entries with dynamic form generation
- **📊 Analytics Dashboard** - Budget forecasting, top drivers analysis, and metrics
- **🔐 Secure Authentication** - JWT-based admin authentication
- **💾 Transaction Support** - Atomic operations (e.g., register driver + vehicle)
- **📈 Real-time Charts** - Data visualization with Chart.js

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd RideSharingApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/ridesharedb"
   SERVER_PORT=4000
   JWT_SECRET="your-super-secret-key-change-this"
   JWT_EXPIRES_IN="7d"
   ```

4. **Start MySQL with Docker** (optional):
   ```bash
   docker-compose up -d
   ```

5. **Set up the database**:
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Create database tables
   npx prisma db push
   
   # Seed database with sample data (optional)
   npx prisma db seed
   ```

6. **Build Tailwind CSS**:
   ```bash
   npm run build
   ```

7. **Start the server**:
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

8. **Access the application**:
   Open your browser and navigate to:
   ```
   http://localhost:4000
   ```

## 🏗️ Project Structure

```
RideSharingApp/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Sample data seeding
├── src/
│   ├── config/
│   │   ├── env.js             # Environment configuration
│   │   └── prisma.js          # Prisma client
│   ├── controllers/           # Request handlers
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── schema.controller.js
│   │   ├── table.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js # JWT authentication
│   ├── repositories/
│   │   └── utility.repository.js
│   ├── routes/                # API routes
│   │   ├── analytics.route.js
│   │   ├── auth.route.js
│   │   ├── schema.route.js
│   │   ├── table.route.js
│   │   └── transaction.route.js
│   ├── views/                 # EJS templates
│   │   ├── auth/
│   │   │   └── login.ejs
│   │   └── dashboard.ejs
│   ├── css/
│   │   └── input.css          # Tailwind input
│   └── app.js                 # Express app entry
├── public/
│   └── css/
│       └── output.css         # Compiled Tailwind
├── .env                       # Environment variables
├── docker-compose.yml         # MySQL container
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/register` - Register new admin
- `GET /auth/login` - Login page

### Protected Endpoints (require JWT token)
- `GET /api/schema` - Get database schema
- `GET /api/tables/:tableName` - Get table data
- `POST /api/tables/:tableName` - Add record to table
- `GET /api/analytics/forecast` - Budget forecast
- `GET /api/analytics/top-drivers` - Top drivers analysis
- `GET /api/analytics/table/:tableName` - Table analytics
- `POST /api/transactions/register-driver-vehicle` - Register driver + vehicle

## 📊 Database Schema

### Core Tables

1. **user** - Riders who book rides
2. **driver** - Drivers who provide rides
3. **vehicle** - Vehicles used for rides
4. **ride** - Trip/ride records
5. **payment** - Payment transactions
6. **payment_method** - User payment preferences
7. **card** - Card payment details
8. **cash** - Cash payment records
9. **rating** - User reviews and ratings
10. **driver_vehicle** - Links drivers to their vehicles
11. **books** - Links users to their ride bookings

## 🎯 Usage Guide

### Logging In

1. Navigate to `http://localhost:4000`
2. Use credentials from seeded users or create new account
3. Default admin credentials (if seeded):
   - Email: admin@rideshare.com
   - Password: password123

### Data Browser

1. Click "Data Browser" in the sidebar
2. Select a table from the dropdown
3. Click "Load Data" to view records
4. Tables display with all columns and data

### Adding Records

1. Click "Add Records" in the sidebar
2. Select a table
3. Click "Generate Form"
4. Fill in the required fields
5. Click "Save Record"

### Special Transaction: Register Driver + Vehicle

1. Go to "Add Records"
2. Click "New Driver + Vehicle"
3. Fill in driver details (name, email, phone)
4. Fill in vehicle details (type, model, license plate)
5. Click "Register All"
6. This atomically creates driver, vehicle, and links them

### Analytics

1. Click "Analytics" in the sidebar
2. Choose a tool:
   - **Budget Forecast**: Set inflation rate, run projection
   - **Top Drivers**: Set count and type (best/worst)
   - **Custom Query**: (Placeholder for SQL execution)
3. View results in formatted tables

## 🔒 Security

- **JWT Authentication**: All API routes protected
- **Password Hashing**: bcryptjs with salt rounds
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security HTTP headers
- **Input Validation**: Express-validator

## 🎨 Customization

### Theme Colors

Edit `src/views/dashboard.ejs` CSS to customize:
- Primary: `#4f46e5` (Indigo)
- Success: `#10b981` (Emerald)
- Error: `#ef4444` (Red)
- Background: `#f9fafb` (Gray-50)

### Adding New Tables

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update `repositories/utility.repository.js` if needed
4. Create controller/route if custom logic needed

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check MySQL is running
docker ps

# Test connection
npx prisma studio
```

### Prisma Client Errors

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database
npx prisma migrate reset
```

### Port Already in Use

Change `SERVER_PORT` in `.env` to a different port (e.g., 5000)

### Token Errors

Clear localStorage in browser:
```javascript
localStorage.removeItem('rideSharingToken')
```

## 📝 NPM Scripts

```bash
npm start              # Start production server
npm run dev            # Start with nodemon + Tailwind watch
npm run build          # Build Tailwind CSS
npm run tailwind:watch # Watch Tailwind changes
```

## 🤝 Contributing

This is a database project for SMU Semester 1. For issues or improvements, contact the development team.

## 📄 License

ISC - Internal Educational Project

## 👥 Credits

- **Database Design**: Ride-sharing schema with Prisma ORM
- **Frontend**: EJS, TailwindCSS, Chart.js
- **Backend**: Express.js, MySQL
- **Authentication**: JWT, bcryptjs

---

**Built with ❤️ for SMU Database Course**
