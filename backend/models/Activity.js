import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add activity title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Work', 'Exercise', 'Entertainment', 'Sleep', 'Social', 'Learning', 'Meals', 'Other']
  },
  startTime: {
    type: Date,
    required: [true, 'Please add start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please add end time']
  },
  duration: {
    type: Number, // in minutes
    required: false
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calculate duration before saving
activitySchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const diffMs = this.endTime - this.startTime;
    this.duration = Math.round(diffMs / (1000 * 60)); // Convert to minutes
  }
  next();
});

// Create indexes for better query performance
activitySchema.index({ userId: 1, date: -1 });
activitySchema.index({ category: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
