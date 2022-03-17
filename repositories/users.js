const Repository = require('./repository')
const crypto = require('crypto')
const util = require('util')
const scrypt = util.promisify(crypto.scrypt)

class UserRepository extends Repository{
    async create(userObject) {
        const records = await this.getAll()
        const salt = crypto.randomBytes(8).toString('hex')
        const buffer = await scrypt(userObject.password, salt, 64)

        userObject.id = this.randomID()

        const record = {
            ...userObject,
            password: `${buffer.toString('hex')}.${salt}`
        }

        records.push(record)

        await this.writeAll(records)

        return record
    }

    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.')
        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64)

        return hashed === hashedSuppliedBuffer.toString('hex')
    }
}

module.exports = new UserRepository('users.json')
