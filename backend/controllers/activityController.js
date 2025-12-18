import Activity from '../models/Activity.js';

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res) => {
  try {
    const { title, category, startTime, endTime, date, notes } = req.body;
    console.log(req.body);
    const activity = await Activity.create({
      userId: req.user._id,
      title,
      category,
      startTime,
      endTime,
      date,
      notes
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all activities for logged in user
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    let query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (category) {
      query.category = category;
    }

    const activities = await Activity.find(query).sort({ date: -1, startTime: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (activity && activity.userId.toString() === req.user._id.toString()) {
      res.json(activity);
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics - time per category
// @route   GET /api/activities/analytics/category
// @access  Private
export const getCategoryAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = { userId: req.user._id };
    
    if (startDate && endDate) {
      matchStage.date = { $gte: startDate, $lte: endDate };
    }

    const analytics = await Activity.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          totalMinutes: { $sum: '$duration' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          totalMinutes: 1,
          totalHours: { $round: [{ $divide: ['$totalMinutes', 60] }, 2] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { totalMinutes: -1 } }
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get daily analytics
// @route   GET /api/activities/analytics/daily
// @access  Private
export const getDailyAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = { userId: req.user._id };
    
    if (startDate && endDate) {
      matchStage.date = { $gte: startDate, $lte: endDate };
    }

    const analytics = await Activity.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$date',
          totalMinutes: { $sum: '$duration' },
          activities: { $sum: 1 }
        }
      },
      {
        $project: {
          date: '$_id',
          totalMinutes: 1,
          totalHours: { $round: [{ $divide: ['$totalMinutes', 60] }, 2] },
          activities: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get productivity score
// @route   GET /api/activities/analytics/productivity
// @access  Private
export const getProductivityScore = async (req, res) => {
  try {
    const { date } = req.query;
    
    const productiveCategories = ['Work', 'Exercise', 'Learning'];
    const matchStage = { userId: req.user._id };
    
    if (date) {
      matchStage.date = date;
    }

    const [productive, total] = await Promise.all([
      Activity.aggregate([
        { $match: { ...matchStage, category: { $in: productiveCategories } } },
        { $group: { _id: null, totalMinutes: { $sum: '$duration' } } }
      ]),
      Activity.aggregate([
        { $match: matchStage },
        { $group: { _id: null, totalMinutes: { $sum: '$duration' } } }
      ])
    ]);

    const productiveMinutes = productive[0]?.totalMinutes || 0;
    const totalMinutes = total[0]?.totalMinutes || 0;
    const productivityScore = totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 0;

    res.json({
      productiveMinutes,
      totalMinutes,
      productivityScore,
      productiveHours: Math.round((productiveMinutes / 60) * 100) / 100,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
