import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import petsRoutes from "./routes/PetsRoutes";
import path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'routes/public/uploads')));


//ruta del servicio de Mascotas
app.use("/api/pets", petsRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || "4002";
app.listen(PORT, () => {
    console.log(`Microservicio de Mascotas corriendo en el puerto: ${PORT}`);
});
