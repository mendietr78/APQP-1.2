const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InspsSchema = new Schema({
    partId: {
        type: Schema.Types.ObjectId,
        ref: 'part',
        required: [true, 'PartId es requerido']
    },
    pa6: {
        type: String,
        required: [true, 'pa6 es requerido'],
        trim: true
    },
    ch1: { type: String, default: null },
    ch2: { type: String, default: null },
  ch3: String,
  ch4: String,
  ch5: String,
  ch6: String,
  ch7: String,
  ch8: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar la fecha de modificación
InspsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Insps", InspsSchema);