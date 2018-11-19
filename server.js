const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose'),
      autoIncrement = require('mongoose-auto-increment');
let connection = mongoose.createConnection(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
autoIncrement.initialize(connection)
const Schema = mongoose.Schema
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let User_Schema = new Schema({
  user: {type:String, unique:true}
})

let Workout_Schema = new Schema({
  user: {type:String, unique:true}
})

User_Schema.plugin(autoIncrement.plugin, {model: 'User_Schema', field: 'userId'});

let URL_model = connection.model('User', User_Schema)
let Workout_model = connection.model('Workouts', Workout_Schema)


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

app.post("/api/exercise/new-user", function (req, res){})

app.post("/api/exercise/log", function (req, res){})

app.get("/api/exercise/users", function (req, res){})

app.get("/api/exercise/users/:log/:from?/:to?/:limit?", function (req, res){})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
