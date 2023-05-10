const mongoose = require('mongoose');
require('../mongoose.js')
//task validator
const schemades = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    complete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
const taskmodel = mongoose.model('tasks', schemades);

//
module.exports = taskmodel;