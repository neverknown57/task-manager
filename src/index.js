const express = require('express');
const path = require('path');
const taskrouter = require('./router/taskroute.js');
const usersrouter = require('./router/usersroute.js');

var bodyParser = require('body-parser')
// const bootstrap = require('bootstrap')
let cors = require("cors");
const app = express();
app.use(cors());
console.log(__dirname)
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/public')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})
//middleware
//parsing in json
// app.use('/user', (req, res, next) => {
//     res.send('all req disabled')
// })

app.use(express.json())
//routing task request
app.use('/', taskrouter)
//routing  userrequest
app.use('/', usersrouter)

// const multer = require('multer')
// const upload = multer({ dest: './task-manager/images' })
// app.post('/upload', upload.single('uploaded_file'), function (req, res) {
//     // req.file is the name of your file in the form above, here 'uploaded_file'
//     // req.body will hold the text fields, if there were any 
//     console.log(req.file, req.body)
// });


app.listen(port, () => {
    console.log("App is listening on the port", port)
})

// const Task = require('./models/task')
// const User = require('./models/users')

// const main = async () => {
//     const user = await User.findById('644e54c26183e2cff94baf6d')
//     console.log(user.author)
//     await user.populate('taskByUser')
//     console.log(user.taskByUser)

//     // const user = await User.findById('5c2e4dcb5eac678a23725b5b')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }

// main()