const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InspsSchema = new Schema({
    partId: {
        type: Schema.Types.ObjectId,
        ref: 'part',
        required: true
    },
    ch1: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
    ch2: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
    ch3: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
    ch4: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
    ch5: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
    ch6: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
    ch7: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
    ch8: {
        type: Schema.Types.ObjectId,
        ref: 'chrc'
    },
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