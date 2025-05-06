import { Router } from "express";
import { getProduct, 
    getCategories,
    getProductDetails, 
    sendReview, 
    getReviews, 
    addCart, 
    cartCount,
    getCart,
    updateCartItem,
    deleteCartItem,
    deleteCart,
    getWishlist,
    toggleWishlist} from "../controllers/ProductController";

const router = Router();

//ruta para obtener productos
router.get("/", getProduct);

//ruta para obtener categorias
router.get("/getCategories", getCategories);

//ruta para obtener detalles del producto
router.get("/details/:id", getProductDetails);

//ruta para enviar reseñas
router.post("/sendReview", sendReview);

//ruta para obtener reseñas por id del producto
router.get("/getReviews/:id", getReviews);

//ruta para añadir productos al carrito
router.post("/addCart", addCart);

//ruta para obtener el contador del carrito
router.get("/cartCount/:IdUser", cartCount);

//ruta para obtener el carrito del usuario
router.get("/getCart/:IdUser", getCart);

//ruta para actualizar el conteo del carrito
router.patch("/updateCartItem/:IdCart", updateCartItem);

//ruta para eliminar un producto del carrito
router.delete("/deleteCartItem/:IdCart", deleteCartItem);

//ruta para vaciar el carrito
router.delete('/deleteCart', deleteCart);

// obtener wishlist de un usuario
router.get('/getWishlist/:userId', getWishlist);

// agregar o eliminar wishlist de un usuario
router.post('/toggleWishlist', toggleWishlist);

export default router; 
