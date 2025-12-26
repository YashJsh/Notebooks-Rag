import { Hono } from "hono";
import { cors } from 'hono/cors'
import dataRoute from "./src/routes/route";


const app = new Hono();
app.use('/api/*', cors());


app.route("/api",dataRoute);

export default app;
