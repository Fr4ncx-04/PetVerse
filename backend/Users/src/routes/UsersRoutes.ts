import {Router} from "express";
import {getUsers,
    getUserById,
    getRoles,
    registerUsers,
    loginUsers,
    getVeterinarian } from "../controllers/UsersController"

const router=Router();

//ruta para obtener todos los usuarios
router.get('/',getUsers);

//ruta para obtener usuario por id
router.get("/getUserById/:id", getUserById);

//ruta para obtener roles
router.get("/getRoles", getRoles);

//ruta para registrar usuarios
router.post("/registerUsers", registerUsers);

//ruta para iniciar sesion
router.post("/loginUsers", loginUsers);

//ruta para obtener veterinarios
router.get('/getVeterinarian/:IdVeterinarian', getVeterinarian);


export default router; 