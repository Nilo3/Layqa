const express = require("express")
const router = express.Router();
const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");


router.route("/products").get( isAuthenticatedUser, getProducts)
router.route("/products/:id").get(getSingleProduct);

router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),newProduct); 

router.route("/admin/product/:id")
            .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
            .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview)
router.route("/review").get(isAuthenticatedUser, getProductReviews)
router.route("/review").delete(isAuthenticatedUser, deleteReview)


module.exports = router