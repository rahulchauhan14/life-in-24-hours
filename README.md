# Life in 24 Hours - Personal Time Reality Analyzer 🕐

A MERN stack web application that helps users track, analyze, and visualize how they spend their time throughout the day. Built with MongoDB Atlas and MongoDB Compass for powerful data analytics.

## 🎯 Problem Statement

People often misjudge how they spend their day. There is no simple system that visually shows actual time usage, time wastage, and productivity patterns.

## ✨ Solution

A comprehensive time tracking and analysis platform that:
- ✅ Logs daily activities with precision
- ✅ Analyzes time spent across categories
- ✅ Detects time leakage patterns
- ✅ Displays productivity insights with beautiful charts
- ✅ Uses MongoDB Compass for advanced data exploration

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas |
| **DB Tool** | MongoDB Compass |
| **Auth** | JWT (JSON Web Tokens) |
| **Charts** | Chart.js + React-Chart.js-2 |
| **Styling** | Custom CSS |

## 📁 Project Structure

```
24hr-a-day/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js     # User authentication logic
│   │   └── activityController.js # Activity CRUD + analytics
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Activity.js           # Activity schema with indexes
│   ├── routes/
│   │   ├── userRoutes.js         # User routes
│   │   └── activityRoutes.js     # Activity routes
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Login.jsx         # Login form
│   │   │   ├── Register.jsx      # Registration form
│   │   │   ├── Dashboard.jsx     # Analytics dashboard with charts
│   │   │   ├── ActivityForm.jsx  # Add new activity
│   │   │   └── ActivityList.jsx  # View/filter activities
│   │   ├── services/
│   │   │   └── api.js            # Axios API configuration
│   │   ├── App.jsx               # Main app component with routing
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId("..."),
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "password": "hashed_password",
  "createdAt": ISODate("2025-12-18T10:00:00Z"),
  "updatedAt": ISODate("2025-12-18T10:00:00Z")
}
```

### Activities Collection
```javascript
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "title": "Watching YouTube",
  "category": "Entertainment",
  "startTime": ISODate("2025-12-18T19:00:00Z"),
  "endTime": ISODate("2025-12-18T20:30:00Z"),
  "duration": 90,              // in minutes
  "date": "2025-12-18",        // YYYY-MM-DD format
  "notes": "Tech tutorials",
  "createdAt": ISODate("2025-12-18T20:30:00Z"),
  "updatedAt": ISODate("2025-12-18T20:30:00Z")
}
```

**Indexes:**
- `userId + date` (compound index for faster queries)
- `category` (single field index)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- MongoDB Compass (optional but recommended)

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier available)
   - Get your connection string
   - Update `.env` file:
     ```env
     PORT=5000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life24hours?retryWrites=true&w=majority
     JWT_SECRET=your_secret_key_change_this_in_production
     NODE_ENV=development
     ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   ```bash
   cp .env.example .env
   ```
   Content:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📊 MongoDB Compass Usage (IMPORTANT FOR DEMO)

MongoDB Compass is a visual tool for exploring and manipulating MongoDB data. This is crucial for hackathon demonstrations!

### Connecting to Your Database

1. **Open MongoDB Compass**
2. **Get connection string from MongoDB Atlas:**
   - Click "Connect" on your cluster
   - Choose "Connect using MongoDB Compass"
   - Copy the connection string
3. **Paste in Compass and connect**

### Viewing Collections

After logging activities in the app:
1. Navigate to `life24hours` database
2. View `users` collection - see registered users
3. View `activities` collection - see all logged activities

### Running Aggregation Pipelines

#### Example 1: Total Time Per Category
```javascript
[
  {
    $match: { 
      userId: ObjectId("YOUR_USER_ID_HERE") 
    }
  },
  {
    $group: {
      _id: "$category",
      totalMinutes: { $sum: "$duration" },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      category: "$_id",
      totalMinutes: 1,
      totalHours: { $divide: ["$totalMinutes", 60] },
      count: 1,
      _id: 0
    }
  },
  {
    $sort: { totalMinutes: -1 }
  }
]
```

#### Example 2: Daily Activity Summary
```javascript
[
  {
    $match: {
      userId: ObjectId("YOUR_USER_ID_HERE"),
      date: { $gte: "2025-12-11", $lte: "2025-12-18" }
    }
  },
  {
    $group: {
      _id: "$date",
      totalMinutes: { $sum: "$duration" },
      activities: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
]
```

#### Example 3: Productivity Analysis
```javascript
[
  {
    $match: { 
      userId: ObjectId("YOUR_USER_ID_HERE") 
    }
  },
  {
    $group: {
      _id: {
        $cond: [
          { $in: ["$category", ["Work", "Exercise", "Learning"]] },
          "Productive",
          "Non-Productive"
        ]
      },
      totalHours: { 
        $sum: { $divide: ["$duration", 60] } 
      }
    }
  }
]
```

### Creating Indexes (Performance Demo)

1. Go to `activities` collection
2. Click "Indexes" tab
3. Click "Create Index"
4. Add index on `userId` and `date`:
   ```javascript
   { "userId": 1, "date": -1 }
   ```
5. Show improved query performance!

## 🎨 Features

### 1. User Authentication
- Secure registration with password hashing (bcrypt)
- JWT-based login
- Protected routes

### 2. Activity Logging
- Log activities with:
  - Title
  - Category (Work, Exercise, Entertainment, Sleep, Social, Learning, Meals, Other)
  - Start/End time
  - Date
  - Optional notes
- Automatic duration calculation

### 3. Analytics Dashboard
- **Pie Chart:** Time distribution by category
- **Bar Chart:** Daily activity hours
- **Productivity Score:** Percentage of productive time
- Date range filtering
- Category breakdown table

### 4. Activity Management
- View all activities
- Filter by category and date range
- Delete activities
- Color-coded categories

## 🔥 Hackathon Demo Plan

### Live Demonstration Flow (5-7 minutes)

1. **Introduction (30 seconds)**
   - Show problem statement
   - Explain solution approach

2. **Frontend Demo (2 minutes)**
   - Register new user
   - Log 2-3 activities (different categories)
   - Show dashboard updating in real-time

3. **MongoDB Compass Magic (2-3 minutes)** ⭐
   - Open MongoDB Compass
   - Show `activities` collection with newly inserted documents
   - Run aggregation pipeline live
   - Explain how aggregation calculates analytics
   - Show indexes

4. **Backend API (1 minute)**
   - Show API endpoints in code
   - Explain analytics calculation logic
   - Show controller using aggregation

5. **Results & Impact (1 minute)**
   - Show final dashboard with charts
   - Explain productivity insights
   - Mention scalability with MongoDB

### Key Talking Points

✅ **Real-time data flow:** Frontend → Backend → MongoDB → Compass
✅ **Powerful aggregations:** Complex analytics with simple pipelines
✅ **Scalability:** Indexed queries for performance
✅ **Production-ready:** JWT auth, error handling, validation

## 📡 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Activities
- `POST /api/activities` - Create activity (protected)
- `GET /api/activities` - Get all activities (protected)
  - Query params: `startDate`, `endDate`, `category`
- `GET /api/activities/:id` - Get single activity (protected)
- `PUT /api/activities/:id` - Update activity (protected)
- `DELETE /api/activities/:id` - Delete activity (protected)

### Analytics
- `GET /api/activities/analytics/category` - Time per category
- `GET /api/activities/analytics/daily` - Daily breakdown
- `GET /api/activities/analytics/productivity` - Productivity score

## 🎯 Categories

- **Work** - Professional tasks
- **Exercise** - Physical activities
- **Entertainment** - Leisure activities
- **Sleep** - Rest time
- **Social** - Social interactions
- **Learning** - Educational activities
- **Meals** - Eating time
- **Other** - Miscellaneous

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Environment variables for sensitive data
- CORS configuration
- Input validation

## 📈 Future Enhancements

- [ ] Weekly/Monthly reports
- [ ] Goal setting and tracking
- [ ] Activity recommendations
- [ ] Export data to CSV/PDF
- [ ] Mobile app
- [ ] Social features (compare with friends)
- [ ] AI-powered insights
- [ ] Calendar integration

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API URL in frontend

### MongoDB Compass connection issues
- Use the correct connection string
- Ensure network access is configured in Atlas
- Check firewall settings

## 👨‍💻 Developer

**Rahul**
- GitHub: [Your GitHub]
- Email: rahul@gmail.com

## 📄 License

MIT License - Feel free to use this project for your hackathon or learning!

## 🙏 Acknowledgments

- MongoDB for excellent database and tooling
- React and Express communities
- Chart.js for beautiful visualizations

---

## 🎓 Learning Resources

- [MongoDB Aggregation Pipeline](https://www.mongodb.com/docs/manual/aggregation/)
- [MongoDB Compass Guide](https://www.mongodb.com/docs/compass/current/)
- [React Router Documentation](https://reactrouter.com/)
- [JWT Authentication Guide](https://jwt.io/introduction)

---

**⭐ Star this repo if you found it helpful!**

**Good luck with your hackathon! 🚀**
