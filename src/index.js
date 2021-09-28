const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


const Task = require('./models/task')
const User = require('./models/user')

const main  = async () => {
    // const task = await Task.findById('6153638b4eec064705f102e3')
    // await task.populate('owner').execPopulate() // used to know which user created a task
    // console.log(task.owner)

    // const user = await User.findById('615360ab6f4d3643f29a0025')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
}
main()

