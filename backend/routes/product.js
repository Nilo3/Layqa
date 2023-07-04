const express = require("express")
const router = express.Router();
const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/products").get( isAuthenticatedUser, getProducts)
router.route("/products/:id").get(getSingleProduct);

router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),newProduct); 

router.route("/admin/product/:id")
            .put(authorizeRoles("admin"),isAuthenticatedUser,updateProduct)
            .delete(authorizeRoles("admin"),isAuthenticatedUser,deleteProduct);


module.exports = router