const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InspsSchema = new Schema({
    partId: {
        type: Schema.Types.ObjectId,
        ref: 'Part',
        required: [true, 'El ID de la parte es requerido'],
        index: true
    },
    pa6: {
        type: String,
        required: [true, 'El número de parte (PA6) es requerido'],
        trim: true,
        uppercase: true,
        index: true
    },
    ch1: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch2: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch3: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch4: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch5: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch6: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch7: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch8: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch9: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch10: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch11: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch12: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch13: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    ch14: { 
        type: Schema.Types.ObjectId, 
        ref: 'Chrc',
        default: null 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Opciones del esquema
    versionKey: false, // No incluir el campo __v
    toJSON: { virtuals: true }, // Incluir virtuals al convertir a JSON
    toObject: { virtuals: true } // Incluir virtuals al convertir a objeto
});

// Middleware para actualizar la fecha de modificación
InspsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware para actualizar la fecha de modificación en operaciones update
InspsSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Virtual para obtener las características asignadas como array
InspsSchema.virtual('assignedCharacteristics').get(function() {
    const chars = [];
    for (let i = 1; i <= 14; i++) {
        if (this[`ch${i}`]) {
            chars.push({
                position: i,
                charId: this[`ch${i}`]
            });
        }
    }
    return chars;
});

// Virtual para contar características asignadas
InspsSchema.virtual('characteristicsCount').get(function() {
    let count = 0;
    for (let i = 1; i <= 14; i++) {
        if (this[`ch${i}`]) count++;
    }
    return count;
});

// Método estático para buscar por número de parte (PA6)
InspsSchema.statics.findByPa6 = function(pa6) {
    return this.findOne({ pa6: pa6.toUpperCase() });
};

// Método para asignar una característica
InspsSchema.methods.assignCharacteristic = function(charId, position) {
    if (position < 1 || position > 14) {
        throw new Error('La posición debe estar entre 1 y 14');
    }
    
    // Verificar si ya está asignada en otra posición
    for (let i = 1; i <= 14; i++) {
        if (this[`ch${i}`] && this[`ch${i}`].equals(charId)) {
            throw new Error('Esta característica ya está asignada en la posición CH' + i);
        }
    }
    
    this[`ch${position}`] = charId;
    return this.save();
};

// Método para desasignar una característica
InspsSchema.methods.unassignCharacteristic = function(position) {
    if (position < 1 || position > 14) {
        throw new Error('La posición debe estar entre 1 y 14');
    }
    
    this[`ch${position}`] = null;
    return this.save();
};

// Índices compuestos para mejorar búsquedas frecuentes
InspsSchema.index({ partId: 1, pa6: 1 });
InspsSchema.index({ pa6: 1, updatedAt: -1 });

// Configuración para transformar el objeto al devolverlo
InspsSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Convertir ObjectIds a strings para ch1-ch14
        for (let i = 1; i <= 14; i++) {
            if (ret[`ch${i}`] && ret[`ch${i}`]._id) {
                ret[`ch${i}`] = ret[`ch${i}`]._id.toString();
            }
        }
        return ret;
    }
});

module.exports = mongoose.model('Insps', InspsSchema);