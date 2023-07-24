const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errors")
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")
const fileUpload = require("express-fileupload")
const cors = require("cors");
const mercadopago = require("mercadopago");
const dotenv = require("dotenv")

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());

dotenv.config({ path: "backend/config/config.env" });

mercadopago.configure({
    access_token: "",
})


app.get("/" , function(req,res) {
    res.send("El servidor de mercadopago funciona")
})

app.post("/create_preference" , (req,res) => {
    let preference = {
        items: [
            {
                title: req.body.name,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity)
            },
        ],
        back_urls: {
            success: "http://localhost:3000",
            failure: "http://localhost:3000",
            pending: "",
        },
        auto_return: "approved",
    };

    mercadopago.preferences
        .create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id
            });
        })
        .catch(function(error) {
            console.log(error);
        })
})

app.listen(8080, () => {
    console.log("Servidor de mercadopago levantado");
})

// Import all routes
const products = require("./routes/product")
const auth = require("./routes/auth")
const order = require("./routes/order")

app.use("/api/v1", products)
app.use("/api/v1", auth)
app.use("/api/v1", order)

//Middleware to handle errors
app.use(errorMiddleware)

module.exports = app
