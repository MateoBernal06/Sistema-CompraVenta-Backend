
// Requerir los módulos
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import administradorRouter from "./routes/administrador_routes.js";
import estudiantesRouter from "./routes/estudiante_routes.js";
import categoriasRouter from "./routes/categoria_routes.js";
import publicacionRouter from "./routes/publicacion_routes.js";
import morgan from "morgan";

// Inicializaciones
const app = express();
dotenv.config();

// Variables
app.set("port", process.env.PORT || 3000);

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
app.use("/api", categoriasRouter);
app.use("/api", publicacionRouter);

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

export default app;