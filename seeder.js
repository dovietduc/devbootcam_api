const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// load env vars
dotenv.config({path: './config/config.env'});

// load Model
const Bootcamp = require("./models/Bootcamp");

// connect to database
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Mongodb connection: ${conn.connection.host}`)
}
connectDB();


// read json file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`), 'utf-8');

// Import into database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log("data imported");
        process.exit();
    } catch (error) {
        console.log(error);
    }
}


// Delete data

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log("data destroys");
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

// create or delete data
if(process.argv[2] === "-i") {
    importData();
} else if(process.argv[2] === "-d") {
    deleteData();
}

