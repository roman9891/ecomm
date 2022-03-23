const userRepo = require('../../repositories/users')
const { check } = require('express-validator')

module.exports = {
    requireTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('Must be between 5-40 characters'),
    requirePrice: check('price')
        .trim()
        .toFloat()
        .isFloat({ min: 1 })
        .withMessage('Must be a value greater than 1'),
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email) => {
            const existingUser = await userRepo.getOneBy({ email })
            if (existingUser) throw new Error('Sorry, Bro. That email is already in use')
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 - 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be between 4 - 20 characters')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) throw new Error("Sorry, Bro. Those passwords didn't match")
            // express-validator bug requires return true
            else return true
        }),
    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (email) => {
            const user = await userRepo.getOneBy({email})
            if (!user) throw new Error('Email not found')
        }),
    requireValidPassword: check('password')
        .trim()
        .custom(async (password, { req }) => {
            const user = await userRepo.getOneBy({ email: req.body.email })
            if (!user) throw new Error('Invalid Password')

            const validPassword = await userRepo.comparePasswords(user.password, password)
            if (!validPassword) throw new Error('Password is incorrect, my dude')
        })
}