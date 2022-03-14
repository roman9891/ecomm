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

app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body
    const existingUser = await userRepo.getOneBy({ email })

    if (existingUser) return res.send('Sorry, Bro. That email is already in use')
    if (password !== passwordConfirmation) return res.send("Sorry, Bro. Those passwords didn't match")

    res.send("No way, Bro! You passed all the checks. You're account is the real deal now. You're the greatest that ever did it.")
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