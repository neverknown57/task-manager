const jwt = require('jsonwebtoken');
const users = require('../models/users.js')
const auth = async (req, res, next) => {
    const token = req.header('authorization').replace('Bearer ', '')
    try {
        // console.log(token)
        const decoded = await jwt.verify(token, process.env.JWT)
        const user = await users.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user)
            throw new Error()
        req.token = token
        req.user = user
        // console.log(req.user)
        next();
    }
    catch (e) {
        res.status(401).send("Autorization failed!")
    }
}
module.exports = auth