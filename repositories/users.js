const fs = require('fs')
const crypto = require('crypto')

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

    async create(userAttributesObject) {
        const records = await this.getAll()

        userAttributesObject.id = this.randomID()
        records.push(userAttributesObject)

        await this.writeAll(records)
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
