# ⚡ Quick Start Guide

Get the RideShare Admin Portal running in 5 minutes!

## 🎯 Prerequisites

- Node.js v16+ installed
- MySQL running (or Docker for MySQL)
- Terminal/Command Prompt

## 🚀 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
# Make sure to change JWT_SECRET!
```

### 3. Start MySQL (If using Docker)
```bash
docker-compose up -d
```

### 4. Set Up Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Build Frontend
```bash
npm run build
```

### 6. Start Server
```bash
# Development mode (recommended)
npm run dev

# OR Production mode
npm start
```

### 7. Access Application
Open browser and go to:
```
http://localhost:4000
```

## 🔐 First Login

### Create Admin User

If you seeded the database, use one of these credentials:
- Email: `admin@rideshare.com`
- Password: `password123`

OR manually create a user via Prisma Studio:
```bash
npx prisma studio
```
Then add a record to the `user` table with hashed password.

OR register via API:
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "password123",
    "phone_number": "1234567890"
  }'
```

## ✅ Verify Everything Works

1. **Login Page** - Should load with styled form
2. **Login** - Enter credentials and submit
3. **Dashboard** - Should redirect to dashboard with sidebar
4. **Schema Loaded** - Sidebar should show all tables
5. **Data Browser** - Select a table and load data
6. **Add Records** - Generate form and add a record

## 🎨 Features to Try

### 📊 Data Browser
1. Click "Data Browser" in sidebar
2. Select "user" table
3. Click "Load Data"
4. View all user records

### ➕ Add New User
1. Click "Add Records"
2. Select "user" table
3. Click "Generate Form"
4. Fill in: name, email, password
5. Click "Save Record"

### 🚗 Register Driver + Vehicle
1. Go to "Add Records"
2. Click "New Driver + Vehicle"
3. Fill both forms
4. Click "Register All"
5. Check driver and vehicle tables

### 📈 Analytics
1. Click "Analytics"
2. Try "Budget Forecast"
3. Set inflation rate (e.g., 5%)
4. Click "Run Forecast"
5. View 3-year projection

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check MySQL is running
docker ps

# Test connection
npx prisma studio
```

### Port Already in Use
Edit `.env` and change `SERVER_PORT` to different port (e.g., 5000)

### Prisma Client Not Found
```bash
npx prisma generate
```

### CSS Not Loading
```bash
npm run build
```

### Token Errors
Clear browser localStorage:
```javascript
// In browser console:
localStorage.clear()
```

## 📖 Next Steps

- Read full [README.md](../README.md)
- Check [STARTUP_CHECKLIST.md](.agent/STARTUP_CHECKLIST.md)
- Review [APPLICATION_ANALYSIS.md](.agent/APPLICATION_ANALYSIS.md)
- Explore Prisma schema: `prisma/schema.prisma`

## 💡 Tips

- Use `npm run dev` for auto-reload during development
- Check terminal for helpful logs
- Open browser DevTools to see API requests
- Use Prisma Studio (`npx prisma studio`) to inspect database

## 🎉 Success!

If you can:
- ✅ Login successfully
- ✅ See database tables in sidebar
- ✅ View table data
- ✅ Add new records
- ✅ Run analytics

**You're all set! The application is working cleanly as expected!** 🚀

---

Need help? Check the troubleshooting section or review the complete documentation.
