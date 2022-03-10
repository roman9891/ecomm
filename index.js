const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRepo = require('./repositories/users')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send(`
        <form method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <input name="passwordConfirmation" placeholder="password confirmation">
            <button>Sign Up</button>
        </form>
    `)
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.send("hi there")
})

app.put('/', (req, res) => {
    res.send("hi there")
})

app.delete('/', (req, res) => {
    res.send("hi there")
})

app.listen(port, () => {
    console.log('Listening')
})