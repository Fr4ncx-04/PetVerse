import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/UsersRoutes"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;

app.use("/api/users", usersRoutes);

app.listen(PORT, () => {
    console.log(`Microservicio de Usuarios corriendo en el puerto:${PORT}`);
});
