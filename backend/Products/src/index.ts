import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRoutes from "./routes/ProductRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//ruta del servicio de productos
app.use("/api/products", productsRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || "4000";
app.listen(PORT, () => {
    console.log(`Microservicio de Productos corriendo en el puerto: ${PORT}`);
});
