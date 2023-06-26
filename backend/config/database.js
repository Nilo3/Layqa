const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URL, {
        
    }).then(con => {
        console.log(`MondoDB Database connected with HOST: ${con.connection.host}`);
    })
}

module.exports = connectDatabase