
// Requerir los módulos
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import administradorRouter from "./routes/administrador_routes.js";
import estudiantesRouter from "./routes/estudiante_routes.js";
import morgan from "morgan";

// Inicializaciones
const app = express();
dotenv.config();

// Variables
app.set("port", process.env.PORT || 3000);
app.use(cors());

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.get("/", (req, res) => {
    res.send("Server ok");
});

// Importar las rutas
app.use("/api", administradorRouter);
app.use("/api", estudiantesRouter);

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

export default app;