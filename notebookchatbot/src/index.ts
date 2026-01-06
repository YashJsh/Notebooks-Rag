import { Hono } from "hono";
import { cors } from 'hono/cors'
import apiRoutes from "./routes/index";

const app = new Hono();

app.use("/*", cors({
    origin : process.env.CORS!
}));
app.route("/api/v1", apiRoutes);

export default app;

