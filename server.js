const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: './config/config.env' });

// init app express
const app = express();
const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
    console.log(`Serve running ${PORT}`);
});