const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['s89af89fdsa']
}))
app.use(authRouter)

app.listen(port, () => {
    console.log('Listening')
})