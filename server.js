const express = require("express");
const dotenv = require("dotenv").config({ path: './config/config.env' });
const morgan = require("morgan");
const connectDB = require("./config/db");
const bootcamps = require("./routes/bootcamps");
const errorHandler = require("./middleware/error");


// connect to DB
connectDB();

// init app express
const app = express();
const PORT = process.env.PORT || 5000;

// Dev logging middleware
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// middleware body parse
app.use(express.json());




// router for bootcamps
app.use("/api/v1/bootcamps", bootcamps);
app.use(errorHandler);



const server = app.listen(PORT, () => {
    console.log(`Serve running ${PORT}`);
});

// Handle promise error
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);

    server.close(() => {
        process.exit(1);
    });
});