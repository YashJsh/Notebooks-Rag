import { Hono } from "hono";
import { cors } from 'hono/cors'
import dataRoute from "./src/routes/route";
import authRoute from "./src/routes/auth";


const app = new Hono();
app.use('/api/*', cors());


app.route("/api",dataRoute);
app.route("/auth", authRoute);

export default app;

