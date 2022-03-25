const express = require("express");

const cartRepo = require('../repositories/cart')
const productsRepo = require('../repositories/products')
const cartShowTemplate = require('../views/cart/show')

const router = express.Router()

router.post('/cart/products', async (req, res) => {
    let cart
    const { productID } = req.body

    if (!req.session.cartID) {
        cart = await cartRepo.create({items: []})
        req.session.cartID = cart.id
    } else {
        cart = await cartRepo.getOne(req.session.cartID)
    }

    const existingItem = cart.items.find(item => item.id === productID)

    if (existingItem) existingItem.quantity++
    else cart.items.push({id: productID, quantity: 1})

    await cartRepo.update(cart.id, {
        items: cart.items
    })

    res.redirect('/')
})

router.get('/cart', async (req, res) => {
    if (!req.session.cartID) return res.redirect('/')

    const cart = await cartRepo.getOne(req.session.cartID)

    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id)

        item.product = product
    }

    res.send(cartShowTemplate({ items: cart.items }))
})

router.post('/cart/products/delete', async (req, res) => {
    const { productID } = req.body
    const cart = await cartRepo.getOne(req.session.cartID)
    const items = cart.items.filter(item => item.id !== productID)

    await cartRepo.update(cart.id, { items })

    res.redirect('/cart')
})

module.exports = router