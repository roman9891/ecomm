const { validationResult } = require('express-validator')

module.exports = {
    handleErrors: (templateFunc) => (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.send(templateFunc({ errors }))
        next()
    },
    requireAuth: (req, res, next) => {
        if (!req.session.userID) return res.redirect('/signin')
        next()
    }
}