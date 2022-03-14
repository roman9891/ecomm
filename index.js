const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRepo = require('./repositories/users')
const cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['s89af89fdsa']
}))

app.get('/signup', (req, res) => {
    res.send(`
        <div>
            ${req.session.userID ? `User ID: ${req.session.userID}` : "Not Signed In"}
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `)
})

app.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body
    const existingUser = await userRepo.getOneBy({ email })

    if (existingUser) return res.send('Sorry, Bro. That email is already in use')
    if (password !== passwordConfirmation) return res.send("Sorry, Bro. Those passwords didn't match")

    const user = await userRepo.create({email, password})

    req.session.userID = user.id

    res.send("No way, Bro! You passed all the checks. You're account is the real deal now. You're the greatest that ever did it.")
})

app.get('/signout', (req, res) => {
    req.session = null
    res.send("You're signed out, bro!")
})

app.get('/signin', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <button>Sign In</button>
            </form>
        </div>
    `)
})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body
    const user = await userRepo.getOneBy({ email })

    if (!user) return res.send('Email not found, bro')

    const validPassword = await userRepo.comparePasswords(user.password, password)

    if (!validPassword) return res.send('Password is incorrect, my dude')

    req.session.userID = user.id

    res.send('Aw snap! You logged in!')
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