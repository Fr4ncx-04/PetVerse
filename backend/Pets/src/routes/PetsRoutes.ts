import { Router } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getPets,
  getPetsByUser,
  insertPet,
  getPetStatus,
  getPetSpecies,
  getPetDetails,
  getAppointmentsByPet,
  getPetById,
  updatePetImage,
  getPetsInAdoption} from "../controllers/PetsController";

// Configuración de Multer para guardar la imagen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, './public/uploads/pets');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `pet_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});
//Configuracion para la subida de la imagen
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const isImage = file.mimetype.startsWith('image');
    if (!isImage) return cb(new Error('Solo se permiten archivos de imagen'));
    cb(null, true);
  },
});

const router = Router();

//ruta para Obtener Mascotas
router.get("/getPets", getPets);

//ruta para obtener mascota por su id
router.get("/getPetById/:IdPet", getPetById);

//ruta para obtener detalles de la mascota
router.get('/details/:IdPet', getPetDetails);

//ruta para obtener mascotas por id del usuario
router.get("/getPetsByUser/:IdUser", getPetsByUser);

//ruta para obtener estado de la mascota
router.get("/getPetStatus", getPetStatus);

//ruta para obtener la especie de la mascota
router.get("/getPetSpecies", getPetSpecies);

//ruta para registrar una mascota
router.post('/register', upload.single('image'), insertPet);

//ruta para obtener las citas de una mascota por id
router.get('/getAppointments/:petId', getAppointmentsByPet);

//actualizar imagen de la mascota
router.put("/updateImage/:petId", upload.single('image'), updatePetImage);

//obtener mascotas en adopcion
router.get('/adoption', getPetsInAdoption);


export default router;