const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const userinstance = require('../models/users.js')
const taskmodel = require('../models/task.js')
const auth = require('../middleware/auth.js')

const email = require('../email/email.js')


const router = express.Router();
router.use(express.json());



// user save
router.post('/user', async (req, res) => {
    const usersave = new userinstance(req.body);
    try {
        // savig into DB and returning token
        console.log('hi')
        const token = await usersave.authgen()
        await email.signup(req.body.email, req.body.name)
        // res.send('hq')
        // await usersave.save();
        // console.log(usersave);
        res.status(201).send({ usersave, token });
    }
    catch (err) {
        res.status(500).send(err);
    }
})

router.post('/user/login', async (req, res) => {

    console.log("hi from login")
    console.log(req.body)
    try {
        const user = await userinstance.findByCredintial(req.body.email, req.body.password)
        const token = await user.authgen();
        res.send({ user, token })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

//get user after Authenticate
router.get('/user/me', auth, (req, res) => {

    res.send(req.user)
})
// Get all user
router.get('/user', async (req, res) => {
    try {
        const users = await userinstance.find({})
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

// find by Id
// router.get('/user/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const user = await userinstance.findById(id)
//         res.status(200).send(user);
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// })

// find and updata(patch)

router.patch('/user/me', auth, async (req, res) => {
    // const id = req.params.i;
    // const updates = req.body
    // console.log(req.params)
    // console.log(id, " ", updates)
    // userinstance.findByIdAndUpdate(id, updates, )
    try {
        // const update = await userinstance.findByIdAndUpdate(id, updates, { new: true });
        await userinstance.updateOne({ _id: req.user._id }, req.body)
        // if (!update)
        //     res.status(404).send({ error: 'Not Found' });
        res.send()
    }
    catch (err) { res.status(400).send(err) }
})

// delete user
router.delete('/user/me', auth, async (req, res) => {
    // const user = req.params.user;
    try {
        // const ret = await userinstance.findByIdAndDelete(user);
        await taskmodel.deleteMany({ author: req.user._id })
        // const err = await userinstance.remove(req.user);
        // console.log(err)
        // userinstance.remove(req.user, function (err, result) {
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         console.log("Result :", result)
        //     }
        // })
        await email.deleteAccount(req.user.email, req.user.name)
        await req.user.deleteOne()

        // if (!ret)
        //     res.status(404).send({ "error": "User not found" });

        res.send("Deleted Account")
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// user logout
router.post('/user/logout', auth, async (req, res) => {
    // console.log(req.user)
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // console.log(token, !(token != req.token));
            return (token.token != req.token)
        })
        await req.user.save()
        res.send("logout user")
    } catch (err) { res.status(500).send(err) }
})

router.post('/user/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(() => {
            return false;
        })
        req.user.save()
        res.status(200).send('All logout')
    }
    catch (err) { res.status(500).send(err) }
})

// file upload
function fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/))
        return cb(new Error('upload an image'))

    // To accept the file pass `true`, like so:
    return cb(null, true)

    // You can always pass an error if something goes wrong:
    cb(new Error('I don\'t have a clue!'))

}
limits = {
    fileSize: 2000000
}
upload = multer({ limits, fileFilter })
router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    console.log(req.file)
    try {

        req.user.avatar = await sharp(req.file.buffer).png().resize({ height: 250, width: 250 }).toBuffer();
        // console.log(req.user)
        await req.user.save()
        res.send();
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
// delete avatar
router.delete('user/me/avatar', auth, (req, res) => {
    req.user.avatar = undefined;
    req.user.save();
})
// get avatar
router.get('/user/:id/avatar', async (req, res) => {
    try {
        console.log(req.params.id);
        user = await userinstance.findById(req.params.id)
        // console.log(user);
        if (!user || !user.avatar)
            new Error('not found')
        res.set('Content-Type', 'image/png')
        res.status(200).send(user.avatar)
    } catch (err) {
        res.status(404).send(err.message)
    }
})
module.exports = router