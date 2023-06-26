const app = require("./app")
const dotenv = require("dotenv")
const connectDatabase = require("./config/database")

// Handle Uncaught exceptions
process.on("uncaughtException", err => {
    console.log(`ERROR: ${err.stack}`);
    console.log("Shutting down server due to uncaught exception");
    process.exit(1)
})

// Setting up config file
dotenv.config({ path: "backend/config/config.env" });


// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server started at PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// Handle Unhandled Promises rejections
process.on("unhandledRejection", err => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise rejection");
    server.close(() => {
        process.exit(1)
    })
})