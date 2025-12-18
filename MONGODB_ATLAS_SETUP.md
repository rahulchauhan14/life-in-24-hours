# MongoDB Atlas Setup Checklist

## Step-by-Step Guide with Screenshots Reference

### 1️⃣ Create MongoDB Atlas Account

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Click "Try Free" or "Sign Up"
- [ ] Use Google/GitHub login or create with email
- [ ] Verify email address

---

### 2️⃣ Create Your First Cluster

- [ ] After login, click "Build a Database"
- [ ] Choose deployment type: **"Shared" (FREE M0)**
- [ ] Select cloud provider: **AWS** (recommended)
- [ ] Select region: **Choose closest to your location**
  - US: `us-east-1` (N. Virginia) or `us-west-2` (Oregon)
  - Europe: `eu-west-1` (Ireland)
  - Asia: `ap-south-1` (Mumbai) or `ap-southeast-1` (Singapore)
- [ ] Cluster Name: Leave default or name it `Cluster0`
- [ ] Click "Create Cluster" button
- [ ] Wait 3-5 minutes for cluster creation

---

### 3️⃣ Create Database User

- [ ] In left sidebar, click "Database Access"
- [ ] Click "Add New Database User"
- [ ] Select "Password" authentication method
- [ ] Fill in details:
  - **Username:** `dbuser` (or your choice, remember this!)
  - **Password:** Click "Autogenerate Secure Password" or create your own
  - **IMPORTANT:** Copy and save the password somewhere safe!
- [ ] Database User Privileges:
  - Select "Built-in Role"
  - Choose "Read and write to any database" or "Atlas Admin"
- [ ] Click "Add User"

**Save your credentials:**
```
Username: dbuser
Password: [YOUR_PASSWORD_HERE]
```

---

### 4️⃣ Configure Network Access (Whitelist IP)

- [ ] In left sidebar, click "Network Access"
- [ ] Click "Add IP Address"
- [ ] Choose one option:

**Option A: Allow from Anywhere (Development Only)**
- [ ] Click "Allow Access from Anywhere"
- [ ] This adds `0.0.0.0/0` (any IP can connect)
- [ ] ⚠️ **Security Note:** Only use this for development/hackathons
- [ ] Click "Confirm"

**Option B: Add Current IP (More Secure)**
- [ ] Click "Add Current IP Address"
- [ ] Your IP will be auto-detected
- [ ] Add a comment: "My Development Machine"
- [ ] Click "Confirm"
- [ ] ⚠️ If your IP changes (WiFi switch), you'll need to add the new IP

**Recommended for Hackathon:** Use Option A for simplicity

---

### 5️⃣ Get Connection String

- [ ] In left sidebar, click "Database" (or "Clusters")
- [ ] On your cluster (Cluster0), click "Connect" button
- [ ] Choose: **"Connect your application"**
- [ ] Driver: **Node.js**
- [ ] Version: **5.5 or later**
- [ ] Copy the connection string shown

**It will look like this:**
```
mongodb+srv://dbuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Important modifications needed:**
1. Replace `<password>` with your actual database user password
2. Add database name before the `?`: `/life24hours?retryWrites=true&w=majority`

**Final connection string example:**
```
mongodb+srv://dbuser:MySecurePass123@cluster0.abc12.mongodb.net/life24hours?retryWrites=true&w=majority
```

- [ ] Save this connection string (you'll paste it in `backend/.env`)

---

### 6️⃣ Update Backend Environment File

- [ ] Open file: `backend/.env`
- [ ] Find line: `MONGODB_URI=...`
- [ ] Replace with your connection string from Step 5
- [ ] Ensure password has NO angle brackets `<>`
- [ ] Save the file

**Example `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://dbuser:MySecurePass123@cluster0.abc12.mongodb.net/life24hours?retryWrites=true&w=majority
JWT_SECRET=mysupersecretkey12345
NODE_ENV=development
```

---

### 7️⃣ Test the Connection

- [ ] Open terminal in `backend` folder
- [ ] Run: `npm run dev`
- [ ] Look for success messages:
  ```
  Server running in development mode on port 5000
  MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
  Database: life24hours
  ```

**If you see errors:**

❌ **Error:** `MongooseServerSelectionError: connect ETIMEDOUT`
- **Fix:** Check IP whitelist in Network Access (Step 4)

❌ **Error:** `Authentication failed`
- **Fix:** Verify username and password in connection string

❌ **Error:** `connection string is invalid`
- **Fix:** Ensure no extra spaces, correct format, database name included

---

### 8️⃣ Verify Database in Atlas Dashboard

- [ ] Go back to MongoDB Atlas
- [ ] Click "Database" → "Browse Collections"
- [ ] After running the app and registering a user, you should see:
  - Database: `life24hours`
  - Collections: `users`, `activities`

---

### 9️⃣ MongoDB Compass Setup (Optional but Recommended)

**Download Compass:**
- [ ] Go to https://www.mongodb.com/products/compass
- [ ] Download MongoDB Compass (Community Edition)
- [ ] Install it

**Connect Compass:**
- [ ] Open MongoDB Compass
- [ ] Click "New Connection"
- [ ] Paste your connection string (same as in `.env`)
- [ ] Click "Connect"
- [ ] You should see `life24hours` database (after using the app)

---

### 🔟 Create Indexes (Performance Optimization)

**In MongoDB Compass:**
- [ ] Navigate to `life24hours` → `activities` collection
- [ ] Click "Indexes" tab
- [ ] Click "Create Index"
- [ ] Paste this:
  ```json
  {
    "userId": 1,
    "date": -1
  }
  ```
- [ ] Name: `userId_date_idx`
- [ ] Click "Create"

**Repeat for category index:**
- [ ] Click "Create Index" again
- [ ] Paste:
  ```json
  {
    "category": 1
  }
  ```
- [ ] Name: `category_idx`
- [ ] Click "Create"

---

## ✅ Final Verification Checklist

Before your hackathon presentation:

- [ ] Cluster is created and shows "Active" status
- [ ] Database user created with password saved
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string copied and working
- [ ] Backend `.env` file updated with correct URI
- [ ] Backend server connects successfully (no errors)
- [ ] Database shows in Atlas dashboard
- [ ] MongoDB Compass connected (if using)
- [ ] Indexes created for better performance

---

## 🆘 Troubleshooting Common Issues

### Issue 1: "Cannot connect to cluster"
**Symptoms:** Backend hangs or times out
**Solutions:**
1. Check internet connection
2. Verify IP whitelist includes current IP
3. Try "Allow Access from Anywhere" (0.0.0.0/0)
4. Ensure cluster is "Active" in Atlas dashboard

### Issue 2: "Authentication failed"
**Symptoms:** Error mentions authentication
**Solutions:**
1. Double-check username in connection string
2. Verify password (no `<>` brackets)
3. Ensure user has correct permissions (Atlas Admin)
4. Try recreating database user

### Issue 3: "Database not showing in Atlas"
**Symptoms:** Can't see `life24hours` database
**Solutions:**
1. Run the backend server first
2. Register a user in the frontend
3. Wait a few seconds and refresh Atlas dashboard
4. MongoDB creates database on first write operation

### Issue 4: "Connection string invalid"
**Symptoms:** Error about invalid URI
**Solutions:**
1. Ensure format: `mongodb+srv://user:pass@cluster.xxxx.mongodb.net/dbname?options`
2. No spaces in the connection string
3. Password is URL-encoded if it contains special characters
4. Database name is added before the `?`

---

## 🔒 Security Best Practices

**For Development (Hackathon):**
- ✅ Use "Allow Access from Anywhere" for simplicity
- ✅ Use a simple password (you'll remember)
- ✅ Keep credentials in `.env` file (not committed to git)

**For Production (After Hackathon):**
- ✅ Restrict IP access to specific IPs
- ✅ Use strong, complex passwords
- ✅ Enable 2FA on MongoDB Atlas account
- ✅ Rotate credentials regularly
- ✅ Use environment variables on hosting platform
- ✅ Enable audit logs
- ✅ Set up MongoDB alerts

---

## 📞 Getting Help

**MongoDB University (Free Courses):**
- https://university.mongodb.com/

**MongoDB Community Forums:**
- https://www.mongodb.com/community/forums/

**MongoDB Documentation:**
- https://www.mongodb.com/docs/

**Stack Overflow:**
- Tag: `mongodb` `mongodb-atlas`

---

## 💡 Pro Tips

1. **Free Tier Limits:**
   - Storage: 512 MB
   - RAM: Shared
   - Backups: Not included
   - (More than enough for hackathons!)

2. **Upgrade Reminder:**
   - MongoDB may email you about upgrades
   - For hackathons, free tier is perfect
   - Ignore upgrade prompts for now

3. **Cluster Naming:**
   - Can't rename after creation
   - Default `Cluster0` is fine
   - Or use descriptive name: `life24hours-dev`

4. **Multiple Databases:**
   - One cluster can host multiple databases
   - Use same cluster for different projects
   - Each app can have its own database name

5. **Backup Your Connection String:**
   - Save in password manager
   - Or in a secure note
   - You'll need it multiple times

---

## ✨ You're All Set!

Your MongoDB Atlas is ready for the hackathon. Time to build something amazing! 🚀

**Next Steps:**
1. ✅ Complete this checklist
2. ✅ Start the backend server
3. ✅ Start the frontend
4. ✅ Register and log activities
5. ✅ Practice your demo
6. ✅ Win the hackathon! 🏆
