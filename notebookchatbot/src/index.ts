import { Hono } from "hono";
import { cors } from 'hono/cors'
import apiRoutes from "./routes/index";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

app.use("/*", cors({
    origin : process.env.CORS!,
    credentials : true
}));

app.route("/api/v1", apiRoutes);

export default app;

