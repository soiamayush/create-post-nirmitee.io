const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const connectDatabase = require("./config/database")

// setting up config file
dotenv.config({path : "backend/config/config.env"})

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    }).then(con => {
        console.log(`Mongo db connected with host : ${con.connection.host}`)
    })
}

module.exports = connectDatabase;