const mongoose = require("mongoose")
require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV || 'DEV'

const MONGODB_URI = process.env[`${NODE_ENV}_MONGODB_URI`] || process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
    console.log(`MONGODB_URI not set for NODE_ENV=${NODE_ENV}. Skipping DB connection.`)
} else {
    mongoose.connect(MONGODB_URI).then(() => {
        console.log(`Connected to ${NODE_ENV} MONGODB`)
    }).catch((err) => {
        console.log(`Error while connecting to ${NODE_ENV} MONGODB, with err - ${err}`)
    })
}