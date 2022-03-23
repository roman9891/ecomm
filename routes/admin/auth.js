const express = require('express')

const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPassword } = require('./validators')
const userRepo = require('../../repositories/users')
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')
const { handleErrors } = require('./middlewares')

const router = express.Router()

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }))
})

router.post(
    '/signup', 
    [requireEmail,requirePassword,requirePasswordConfirmation], 
    handleErrors(signupTemplate), 
    async (req, res) => {
        const { email, password } = req.body
        const user = await userRepo.create({email, password})

        req.session.userID = user.id

        res.redirect('/admin/products')
})

router.get('/signout', (req, res) => {
    req.session = null
    res.redirect('/signin')
})

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}))
})

router.post(
    '/signin', 
    [requireEmailExists, requireValidPassword], 
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body
        const user = await userRepo.getOneBy({ email })

        req.session.userID = user.id

        res.redirect('/admin/products')
})

module.exports = router