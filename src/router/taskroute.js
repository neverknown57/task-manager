const mongoose = require('mongoose');
const taskmodel = require('../models/task.js');
const express = require('express');
// const users = require('../models/users.js');
const auth = require('../middleware/auth.js');
const chalk = require('chalk');


const router = express.Router();
//post task
router.post('/task', auth, async function (req, res) {
    console.log(req.body);

    const usertask = new taskmodel(req.body);
    usertask.author = req.user._id
    try {
        await usertask.save();
        res.status(201).send(usertask);
    }
    catch (err) {
        res.status(400).send(err);
    }
})
// task update
router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    // check valid updates
    const allowed = ['description', 'completed']
    const isvalid = updates.every((update) => allowed.includes(update))
    try {

        if (!isvalid)
            return res.status(400).send({ error: 'Invalid update' })
        const task = await taskmodel.findOne({ _id: req.params.id, author: req.user._id })
        if (!task)
            res.status(404).send({ error: 'Task not found' })
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (err) { res.status(500).send(err) }
})
//get task by Id
router.get('/task/:id', auth, async (req, res) => {
    const task = await taskmodel.findOne({ _id: req.params.id, author: req.user._id })
    try {
        console.log(task);
        if (!task)
            res.status(404).send('No task found')
        await task.populate('author', 'name')
        // (function (err, task) {
        //     if (err) return handleError(err);
        //     console.log(task);
        //     console.log('The author is %s', task.author)
        // })
        // console.log(creater)
        res.send(task)
        console.log(task.author);
    } catch (err) {
        // task.poupated('author')
        res.status(500).send(err);
    }
})
//get task by user
router.get('/task', auth, async (req, res) => {
    try {
        console.log((chalk.red(req.user._id)))
        // const usertask = await users.findOne({ '_id': req.user._id })
        // console.log(chalk.blue(usertask))
        await req.user.populate('taskByUser')
        // console.log(usertask.taskByUser)
        console.log(req.user.taskByUser)
        res.send(req.user.taskByUser)
    }
    catch (err) { res.status(500).send(err) }
})
// Delete a task
router.delete('/task/:id', auth, async function (req, res) {
    const task = await taskmodel.findOneAndRemove({ _id: req.params.id, author: req.user._id })
    if (!task)
        res.status(404).send({ error: 'Task not found' })
    try {
        // await task.remove();
        res.status(200).send(task)
    }
    catch (e) { res.status(500).send(e) }
})
module.exports = router