const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [20, 'Name is too big'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      dropDups: true,
      trim: true,
      maxlength: [50, 'Email is too big'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      dropDups: true,
      trim: true,
      maxlength: [50, 'Username is too big'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    active_status: {
      type: Boolean,
      default: false,
      required: [true, 'Status is required'],
    },
    user_type: {
      type: String,
      default: 'member',
      enum: {
        values: ['admin', 'member'],
        message: '{VALUE} is not supported',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
