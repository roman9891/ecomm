const Repository = require("./repository");

class Cart extends Repository {}

module.exports = new Cart('carts.json')