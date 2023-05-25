const express = require('express')
const app = express()

const path = require('path')
const cors = require('cors')

const {logEvents, logger} = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')
const corsOption = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')


const PORT = process.env.PORT || 3500

app.use(logger)

// syntax for creating custom middleware

// app.use((req, res, next) => {
//       console.log(`${req.method}\n${req.path}`)
//       logEvents(`${req.method}\t${req.path}\t${req.headers.origin}`, 'reqLog.txt')
//       next()
// })

//built in middleware to handle url encoded data :
// Content-type application/x-www-form-urlencoded

app.use(express.urlencoded({extended: false}))

// built-in middleware for json data
app.use(express.json());
app.use(cookieParser());

//server static files
app.use('/',express.static(path.join(__dirname,'./Public')))

// routes
app.use('/', require ('./routes/root'))
// register routes 
app.use("/register", require('./routes/register'));
// Auth routes
app.use("/auth", require('./routes/auth'));
app.use("/refresh", require('./routes/refresh'));
app.use(verifyJWT)


// Student routes
app.use('/students', require('./routes/api/students'));





app.use(cors(corsOption))





// catch all routes to get error 404 page

app.all('*',(req, res) => {
      res.status(404);
      if (req.accepts('html')) {
res.sendFile(path.join(__dirname, 'views', '404.html'));
      }else if(req.accepts('json')) {
            res.join({Error: '404 Not Found'})
      }else {
            res.type('txt').send('404 Not Found')
      }
      
      // res.status(404)

})

app.get('/', (req, res, next) => {
      console.log('attempted a request');
      next()
}, (err, res, next) => {
      console.log ('second request attempted')
      next()
}, (req, res) => {
      console.log('final request')
      res.send('hello world')
})

// const a = (req, res, next) => {
//       console.log('attempted a request');
//       next()
// }

// const b =(err, res, next) => {
//       console.log ('second request attempted')
//       next()
// }
// const c = (req, res) => {
//       console.log('final request')
//       res.send('hello world')
// }

//       app.get('/', [a,b,c])

app.use(errorHandler)
      


app.listen(PORT, () => console.log(`server is listening on ${PORT}`))