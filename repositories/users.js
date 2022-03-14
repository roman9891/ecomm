const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const scrypt = util.promisify(crypto.scrypt)

class UserRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename')
        }

        this.filename = filename
        try {
            fs.accessSync(this.filename)
        } catch (error) {
            fs.writeFileSync(this.filename, '[]')
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {encoding: 'utf8'}))
    }

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

    async writeAll (records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
    }

    randomID() {
        return crypto.randomBytes(4).toString('hex')
    }

    async getOne(id) {
        const records = await this.getAll()
        return records.find(record => record.id === id)
    }

    async delete(id) {
        const records = await this.getAll()
        const filteredRecords = records.filter(record => record.id !== id)
        await this.writeAll(filteredRecords)
    }

    async update(id, attributes) {
        const records = await this.getAll()
        const record = records.find(record => record.id === id)

        if (!record) throw new Error("Uh oh! We couldn't find the record.")

        Object.assign(record, attributes)
        await this.writeAll(records)
    }

    async getOneBy(attributes) {
        const records = await this.getAll()

        for (let record of records) {
            let found = true

            for (let key in attributes) {
                if (record[key] !== attributes[key]) found = false
            }

            if (found) return record
        }
    }
}

module.exports = new UserRepository('users.json')
