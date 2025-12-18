# MongoDB Compass - Aggregation Pipeline Examples

This document contains ready-to-use aggregation pipelines for MongoDB Compass demonstrations.

## Setup

1. Open MongoDB Compass
2. Connect to your MongoDB Atlas cluster
3. Navigate to the `life24hours` database
4. Select the `activities` collection
5. Click on the "Aggregations" tab
6. Copy and paste the pipelines below

**Note:** Replace `YOUR_USER_ID_HERE` with an actual ObjectId from your users collection.

---

## Pipeline 1: Total Time Per Category

**Purpose:** Calculate total hours and activity count for each category.

**Use Case:** Understanding where most time is spent.

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
      activityCount: { $sum: 1 }
    }
  },
  {
    $project: {
      category: "$_id",
      totalMinutes: 1,
      totalHours: { 
        $round: [{ $divide: ["$totalMinutes", 60] }, 2] 
      },
      activityCount: 1,
      _id: 0
    }
  },
  {
    $sort: { totalMinutes: -1 }
  }
]
```

**Expected Output:**
```javascript
[
  {
    "category": "Work",
    "totalMinutes": 480,
    "totalHours": 8.0,
    "activityCount": 5
  },
  {
    "category": "Entertainment",
    "totalMinutes": 180,
    "totalHours": 3.0,
    "activityCount": 3
  }
  // ... more categories
]
```

---

## Pipeline 2: Daily Activity Summary

**Purpose:** Show total hours and number of activities per day.

**Use Case:** Track daily time investment trends.

```javascript
[
  {
    $match: {
      userId: ObjectId("YOUR_USER_ID_HERE"),
      date: { 
        $gte: "2025-12-11", 
        $lte: "2025-12-18" 
      }
    }
  },
  {
    $group: {
      _id: "$date",
      totalMinutes: { $sum: "$duration" },
      totalActivities: { $sum: 1 },
      categories: { $addToSet: "$category" }
    }
  },
  {
    $project: {
      date: "$_id",
      totalMinutes: 1,
      totalHours: { 
        $round: [{ $divide: ["$totalMinutes", 60] }, 2] 
      },
      totalActivities: 1,
      uniqueCategories: { $size: "$categories" },
      _id: 0
    }
  },
  {
    $sort: { date: 1 }
  }
]
```

**Expected Output:**
```javascript
[
  {
    "date": "2025-12-11",
    "totalMinutes": 600,
    "totalHours": 10.0,
    "totalActivities": 8,
    "uniqueCategories": 5
  }
  // ... more days
]
```

---

## Pipeline 3: Productivity Score Calculation

**Purpose:** Calculate percentage of time spent on productive vs non-productive activities.

**Use Case:** Measure daily productivity.

**Productive Categories:** Work, Exercise, Learning

```javascript
[
  {
    $match: { 
      userId: ObjectId("YOUR_USER_ID_HERE"),
      date: "2025-12-18"  // Today's date
    }
  },
  {
    $group: {
      _id: {
        $cond: {
          if: { $in: ["$category", ["Work", "Exercise", "Learning"]] },
          then: "Productive",
          else: "Non-Productive"
        }
      },
      totalMinutes: { $sum: "$duration" }
    }
  },
  {
    $group: {
      _id: null,
      categories: {
        $push: {
          type: "$_id",
          minutes: "$totalMinutes"
        }
      },
      grandTotal: { $sum: "$totalMinutes" }
    }
  },
  {
    $project: {
      productive: {
        $arrayElemAt: [
          {
            $filter: {
              input: "$categories",
              cond: { $eq: ["$$this.type", "Productive"] }
            }
          },
          0
        ]
      },
      nonProductive: {
        $arrayElemAt: [
          {
            $filter: {
              input: "$categories",
              cond: { $eq: ["$$this.type", "Non-Productive"] }
            }
          },
          0
        ]
      },
      grandTotal: 1,
      _id: 0
    }
  },
  {
    $project: {
      productiveMinutes: { 
        $ifNull: ["$productive.minutes", 0] 
      },
      nonProductiveMinutes: { 
        $ifNull: ["$nonProductive.minutes", 0] 
      },
      totalMinutes: "$grandTotal",
      productivityScore: {
        $multiply: [
          {
            $divide: [
              { $ifNull: ["$productive.minutes", 0] },
              "$grandTotal"
            ]
          },
          100
        ]
      }
    }
  },
  {
    $project: {
      productiveMinutes: 1,
      nonProductiveMinutes: 1,
      totalMinutes: 1,
      productivityScore: { 
        $round: ["$productivityScore", 2] 
      },
      productiveHours: {
        $round: [
          { $divide: ["$productiveMinutes", 60] },
          2
        ]
      },
      totalHours: {
        $round: [
          { $divide: ["$totalMinutes", 60] },
          2
        ]
      }
    }
  }
]
```

**Expected Output:**
```javascript
[
  {
    "productiveMinutes": 480,
    "nonProductiveMinutes": 240,
    "totalMinutes": 720,
    "productivityScore": 66.67,
    "productiveHours": 8.0,
    "totalHours": 12.0
  }
]
```

---

## Pipeline 4: Most Time-Consuming Activities

**Purpose:** Find the top 5 longest activities.

**Use Case:** Identify time sinks.

```javascript
[
  {
    $match: { 
      userId: ObjectId("YOUR_USER_ID_HERE") 
    }
  },
  {
    $project: {
      title: 1,
      category: 1,
      duration: 1,
      hours: { 
        $round: [{ $divide: ["$duration", 60] }, 2] 
      },
      date: 1
    }
  },
  {
    $sort: { duration: -1 }
  },
  {
    $limit: 5
  }
]
```

**Expected Output:**
```javascript
[
  {
    "title": "Deep Work Session",
    "category": "Work",
    "duration": 240,
    "hours": 4.0,
    "date": "2025-12-18"
  }
  // ... 4 more activities
]
```

---

## Pipeline 5: Weekly Category Trends

**Purpose:** Compare category usage across different weeks.

**Use Case:** Identify patterns and changes over time.

```javascript
[
  {
    $match: { 
      userId: ObjectId("YOUR_USER_ID_HERE"),
      date: { $gte: "2025-12-01" }
    }
  },
  {
    $addFields: {
      week: {
        $week: { $dateFromString: { dateString: "$date" } }
      }
    }
  },
  {
    $group: {
      _id: {
        week: "$week",
        category: "$category"
      },
      totalHours: { 
        $sum: { $divide: ["$duration", 60] } 
      }
    }
  },
  {
    $project: {
      week: "$_id.week",
      category: "$_id.category",
      totalHours: { $round: ["$totalHours", 2] },
      _id: 0
    }
  },
  {
    $sort: { week: 1, totalHours: -1 }
  }
]
```

---

## Pipeline 6: Time Distribution (Percentage)

**Purpose:** Show what percentage of total time each category represents.

**Use Case:** Visual breakdown of time allocation.

```javascript
[
  {
    $match: { 
      userId: ObjectId("YOUR_USER_ID_HERE") 
    }
  },
  {
    $group: {
      _id: null,
      totalMinutes: { $sum: "$duration" },
      categories: {
        $push: {
          category: "$category",
          duration: "$duration"
        }
      }
    }
  },
  {
    $unwind: "$categories"
  },
  {
    $group: {
      _id: "$categories.category",
      categoryMinutes: { $sum: "$categories.duration" },
      totalMinutes: { $first: "$totalMinutes" }
    }
  },
  {
    $project: {
      category: "$_id",
      minutes: "$categoryMinutes",
      percentage: {
        $round: [
          {
            $multiply: [
              { $divide: ["$categoryMinutes", "$totalMinutes"] },
              100
            ]
          },
          2
        ]
      },
      _id: 0
    }
  },
  {
    $sort: { percentage: -1 }
  }
]
```

---

## Pipeline 7: Activity Gaps (Finding Free Time)

**Purpose:** Identify time gaps between activities to find unused time.

**Use Case:** Optimize schedule and find opportunities.

```javascript
[
  {
    $match: { 
      userId: ObjectId("YOUR_USER_ID_HERE"),
      date: "2025-12-18"
    }
  },
  {
    $sort: { startTime: 1 }
  },
  {
    $project: {
      title: 1,
      startTime: 1,
      endTime: 1,
      nextStart: "$startTime"
    }
  },
  {
    $group: {
      _id: null,
      activities: { $push: "$$ROOT" }
    }
  },
  {
    $project: {
      gaps: {
        $map: {
          input: { $range: [0, { $subtract: [{ $size: "$activities" }, 1] }] },
          as: "idx",
          in: {
            from: { $arrayElemAt: ["$activities.endTime", "$$idx"] },
            to: { $arrayElemAt: ["$activities.startTime", { $add: ["$$idx", 1] }] },
            gapMinutes: {
              $divide: [
                {
                  $subtract: [
                    { $arrayElemAt: ["$activities.startTime", { $add: ["$$idx", 1] }] },
                    { $arrayElemAt: ["$activities.endTime", "$$idx"] }
                  ]
                },
                60000
              ]
            }
          }
        }
      }
    }
  },
  {
    $unwind: "$gaps"
  },
  {
    $match: {
      "gaps.gapMinutes": { $gt: 0 }
    }
  },
  {
    $project: {
      from: "$gaps.from",
      to: "$gaps.to",
      gapMinutes: { $round: ["$gaps.gapMinutes", 0] },
      _id: 0
    }
  }
]
```

---

## How to Use During Demo

1. **Before Demo:**
   - Get your user ObjectId from the `users` collection
   - Replace `YOUR_USER_ID_HERE` in all pipelines
   - Test each pipeline to ensure it works

2. **During Demo:**
   - Start with Pipeline 1 (simple and visual)
   - Explain each stage as you add it
   - Show the results updating in real-time
   - Move to Pipeline 3 (productivity score) for impact

3. **Tips:**
   - Use the "Export" button to show you can export results
   - Show the "Explain Plan" to demonstrate query performance
   - Mention indexes and how they help performance

---

## Creating Indexes in Compass

For better performance, create these indexes:

1. **Compound Index on userId and date:**
   ```javascript
   { "userId": 1, "date": -1 }
   ```

2. **Index on category:**
   ```javascript
   { "category": 1 }
   ```

3. **Index on startTime:**
   ```javascript
   { "startTime": 1 }
   ```

**Steps in Compass:**
1. Select the `activities` collection
2. Click "Indexes" tab
3. Click "Create Index"
4. Paste the index definition
5. Click "Create"

---

## Performance Comparison Demo

**Show before/after index creation:**

1. Run a query without index
2. Click "Explain Plan"
3. Note the execution time
4. Create the index
5. Run the same query
6. Show improved execution time

This demonstrates real-world database optimization!

---

**Good luck with your demonstration! 🚀**
