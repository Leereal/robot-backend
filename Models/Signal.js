const mongoose = require('mongoose');

const SignalSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      trim: true,
      maxlength: [20, 'Name is too big'],
    },
    open_price: {
      type: String,
      required: [true, 'Open Price is required'],
    },
    targets: {
      type: [Number],
    },
    stop_loss: {
      type: Number,
    },
    is_profit: {
      type: Boolean,
    },
    results: {
      type: Number,
    },
    active_status: {
      type: String,
      enum: {
        default: 'open',
        values: ['open', 'closed', 'cancelled'],
        message: '{VALUE} is not supported',
      },
    },
    message: {
      type: String,
      min: [5, 'Must be at least 6, got {VALUE}'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['buy', 'sell'],
        message: '{VALUE} is not supported',
      },
    },
    asset: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['forex', 'binary options', 'synthetic indices'],
        message: '{VALUE} is not supported',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Signal', SignalSchema);
