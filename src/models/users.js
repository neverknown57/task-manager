const mongoose = require('mongoose');
require('../mongoose.js')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const taskmodel = require('./task.js');

const user = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        validate(valu) {
            console.log(valu);
            if (!validator.isEmail(valu))
                throw new Error('messagae:Invalid Mail')
        }
    },
    password: {
        type: String,
        min: 6,
        trim: true,
        validate(v) {
            if (v.includes('password'))
                throw new Error('{VALUE} should not contain password as password')
        }
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'Age must be gt 0. {VALUE} can not possible'],
        max: 100
    },
    avatar: {
        type: 'Buffer'
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]

}, { timestamps: true })
// Method on obj
// schema name .method 
user.methods.toJSON = function () {
    const user1 = this
    const objUser = user1.toObject()
    delete objUser.password
    delete objUser.tokens
    delete objUser.avatar
    return objUser
}
// fucnton on specific user
user.methods.authgen = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT)
    // Didn't understand how we are saving user in 2timesin db
    user.tokens = user.tokens.concat({ token });
    try {
        await user.save();
        return token;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
}
// Method on whole shema
user.statics.findByCredintial = async function (email, password) {
    const user1 = await instance.findOne({ email: email, password: password })
    if (!user1)
        throw new Error("Unable to login")
    return user1
}

user.virtual('taskByUser', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'author'
})
// pre is not working
// pre
user.pre('deleteOne', async function (next) {
    const author = this._id
    console.log("conosoling task")
    try {
        await taskmodel.deleteMany({ author: author })
        next()
    } catch (err) { throw new Error(err) }
})
const instance = mongoose.model('users', user) //collection name, schema



module.exports = instance;