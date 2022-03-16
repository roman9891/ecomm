const express = require('express')
const { validationResult } = require('express-validator')
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPassword } = require('./validators')
const userRepo = require('../../repositories/users')
const router = express.Router()
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }))
})

router.post('/signup', [requireEmail,requirePassword,requirePasswordConfirmation], async (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) return res.send(signupTemplate({ req, errors }))

    const { email, password } = req.body
    const user = await userRepo.create({email, password})

    req.session.userID = user.id

    res.send("No way, Bro! You passed all the checks. You're account is the real deal now. You're the greatest that ever did it.")
})

router.get('/signout', (req, res) => {
    req.session = null
    res.send("You're signed out, bro!")
})

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}))
})

router.post('/signin', [requireEmailExists, requireValidPassword], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.send(signinTemplate({errors}))

    const { email } = req.body
    const user = await userRepo.getOneBy({ email })

    req.session.userID = user.id

    res.send('Aw snap! You logged in!')
})

module.exports = router