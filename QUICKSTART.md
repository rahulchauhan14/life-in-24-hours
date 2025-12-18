# 🚀 Quick Start Guide - Life in 24 Hours

Follow these steps to get your application running in minutes!

## ✅ Prerequisites Checklist

- [ ] Node.js installed (v18 or higher) - [Download here](https://nodejs.org/)
- [ ] MongoDB Atlas account - [Sign up free](https://www.mongodb.com/cloud/atlas)
- [ ] MongoDB Compass installed (optional) - [Download here](https://www.mongodb.com/products/compass)
- [ ] Git installed (for version control)
- [ ] Code editor (VS Code recommended)

## 📋 Step-by-Step Setup

### Step 1: MongoDB Atlas Setup (5 minutes)

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Free" (M0 Sandbox)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `dbuser` (or your choice)
   - Password: Create a strong password (save it!)
   - User Privileges: "Atlas admin"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" (Clusters)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Should look like: `mongodb+srv://dbuser:<password>@cluster0.xxxxx.mongodb.net/`

### Step 2: Backend Configuration (2 minutes)

1. **Open backend/.env file**
   ```
   Already created at: backend/.env
   ```

2. **Update MongoDB Connection String**
   - Replace the `MONGODB_URI` value with your connection string
   - Replace `<password>` with your actual database password
   - Add database name: `.../life24hours?retryWrites=true&w=majority`
   
   Example:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://dbuser:MyPassword123@cluster0.xxxxx.mongodb.net/life24hours?retryWrites=true&w=majority
   JWT_SECRET=my_super_secret_key_change_in_production_2025
   NODE_ENV=development
   ```

3. **Update JWT Secret** (Important for security!)
   - Change `JWT_SECRET` to a random string
   - Can generate one here: https://randomkeygen.com/

### Step 3: Start Backend Server (1 minute)

Open a terminal in the `backend` folder:

```bash
cd backend
npm run dev
```

✅ **Success indicators:**
```
Server running in development mode on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
Database: life24hours
```

❌ **Common Issues:**

| Error | Solution |
|-------|----------|
| `MongooseServerSelectionError` | Check MongoDB connection string, ensure IP is whitelisted |
| `JWT_SECRET not defined` | Update .env file with JWT_SECRET |
| `Port 5000 already in use` | Change PORT in .env to 5001 or kill process using port 5000 |

### Step 4: Start Frontend (1 minute)

Open a **NEW terminal** in the `frontend` folder:

```bash
cd frontend
npm run dev
```

✅ **Success indicators:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 5: Access the Application

1. **Open your browser**
2. **Navigate to:** http://localhost:3000
3. **You should see:** The login page

🎉 **Congratulations! Your app is running!**

---

## 🧪 Testing the Application

### Create Your First User

1. Click "Register" on the login page
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: minimum 6 characters
   - Confirm Password: same as above
3. Click "Register"
4. You'll be automatically logged in and redirected to the dashboard

### Log Your First Activity

1. Click "Add Activity" in the navigation
2. Fill in the form:
   - **Title:** "Morning Workout"
   - **Category:** Exercise
   - **Date:** Today's date
   - **Start Time:** 07:00
   - **End Time:** 08:00
   - **Notes:** "Cardio and stretching"
3. Click "Log Activity"
4. You'll be redirected to the dashboard with updated charts!

### Add More Activities for Better Visualization

Add 3-4 more activities to see the charts populate:

```
Activity 2:
- Title: Team Meeting
- Category: Work
- Time: 09:00 - 10:30

Activity 3:
- Title: Lunch Break
- Category: Meals
- Time: 12:00 - 13:00

Activity 4:
- Title: Netflix
- Category: Entertainment
- Time: 20:00 - 22:00
```

---

## 🔍 MongoDB Compass Setup (For Hackathon Demo)

### Connect to Your Database

1. **Open MongoDB Compass**
2. **Paste your connection string**
   - Same one from backend/.env
   - Example: `mongodb+srv://dbuser:password@cluster0.xxxxx.mongodb.net/`
3. **Click "Connect"**

### Explore Your Data

1. **Select database:** `life24hours`
2. **View collections:**
   - `users` - All registered users
   - `activities` - All logged activities

### Run Your First Aggregation

1. Click on `activities` collection
2. Click "Aggregations" tab
3. Copy and paste this pipeline:

```javascript
[
  {
    $group: {
      _id: "$category",
      totalHours: { 
        $sum: { $divide: ["$duration", 60] } 
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { totalHours: -1 }
  }
]
```

4. Click the play button ▶️
5. See your time breakdown by category!

📖 **More pipelines:** See [MONGODB_COMPASS_GUIDE.md](MONGODB_COMPASS_GUIDE.md)

---

## 🎯 Hackathon Demo Checklist

Before presenting:

- [ ] Backend server is running without errors
- [ ] Frontend is accessible at http://localhost:3000
- [ ] You've registered a test user
- [ ] You've logged at least 5-6 diverse activities
- [ ] MongoDB Compass is connected to your database
- [ ] You've tested at least one aggregation pipeline
- [ ] Charts are displaying data correctly on the dashboard

**Demo Flow (5-7 minutes):**
1. ✨ Show the problem (30 sec)
2. 📱 Register new user (30 sec)
3. ➕ Add 2 activities live (1-2 min)
4. 📊 Show dashboard updating (1 min)
5. 🔍 Open MongoDB Compass (2-3 min)
   - Show collections
   - Run aggregation pipeline
   - Explain how MongoDB powers the analytics
6. 🎯 Show final results and impact (1 min)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "MongoDB connection failed"
- **Check:** Internet connection
- **Check:** MongoDB Atlas IP whitelist (should include your current IP)
- **Check:** Username and password in connection string
- **Try:** Replace `<password>` with actual password (no brackets)

**Problem:** "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Frontend Issues

**Problem:** "Cannot connect to backend"
- **Check:** Backend is running on port 5000
- **Check:** No CORS errors in browser console
- **Try:** Clear browser cache and reload

**Problem:** "Charts not displaying"
- **Check:** You have logged activities
- **Check:** Browser console for errors
- **Try:** Add more activities for better visualization

### MongoDB Compass Issues

**Problem:** "Authentication failed"
- **Check:** Username and password are correct
- **Check:** User has proper permissions in MongoDB Atlas
- **Try:** Recreate database user with "Atlas admin" role

---

## 📁 Project Structure Overview

```
24hr-a-day/
├── backend/               # Express.js API
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── .env             # Environment variables (DO NOT COMMIT)
│   └── server.js        # Entry point
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   └── services/    # API calls
│   ├── .env             # Frontend config
│   └── vite.config.js   # Vite configuration
│
├── README.md            # Full documentation
├── MONGODB_COMPASS_GUIDE.md  # Aggregation pipelines
└── QUICKSTART.md        # This file
```

---

## 🎓 Next Steps

1. **Explore the Code**
   - Read through the backend controllers to understand the API
   - Check out React components to see how the UI works
   - Look at the MongoDB models and schemas

2. **Customize**
   - Add more categories
   - Modify the color scheme
   - Add new analytics features

3. **Deploy** (after hackathon)
   - Backend: Render, Railway, or Heroku
   - Frontend: Vercel, Netlify, or Cloudflare Pages
   - Keep using MongoDB Atlas

4. **Learn More**
   - MongoDB Aggregation: https://www.mongodb.com/docs/manual/aggregation/
   - React Router: https://reactrouter.com/
   - Chart.js: https://www.chartjs.org/

---

## 💡 Pro Tips

1. **Keep backend and frontend running in separate terminals** - easier to debug
2. **Use MongoDB Compass during development** - visualize your data changes
3. **Check browser console** - most frontend errors show up there
4. **Save your aggregation pipelines** - reuse them for different queries
5. **Take screenshots** - document your working app for the presentation

---

## 🆘 Need Help?

- **MongoDB Issues:** https://www.mongodb.com/community/forums
- **React Questions:** https://react.dev/community
- **Express.js:** https://expressjs.com/en/guide/routing.html

---

**Good luck with your hackathon! You've got this! 🚀**

---

## ✅ Final Checklist Before Presenting

- [ ] Both servers running without errors
- [ ] Sample data created (5-6 activities minimum)
- [ ] Dashboard shows charts correctly
- [ ] MongoDB Compass connected
- [ ] Tested 2-3 aggregation pipelines
- [ ] Presentation slides ready (optional)
- [ ] Confident in explaining the tech stack
- [ ] Ready to demonstrate live coding (if needed)

**Time to shine! 🌟**
