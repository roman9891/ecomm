const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products')
const cartRouter = require('./routes/carts')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['s89af89fdsa']
}))
app.use(authRouter)
app.use(adminProductsRouter)
app.use(productsRouter)
app.use(cartRouter)

app.listen(port, () => {
    console.log('Listening')
})