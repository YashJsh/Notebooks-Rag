import { Hono } from "hono";
import { cors } from 'hono/cors'
import dataRoute from "./src/routes/route";
import authRoute from "./src/routes/auth";
import notebookRoute from "./src/routes/notebook";


const app = new Hono();
app.use('/*', cors());


app.route("/api",dataRoute);
app.route("/auth", authRoute);
app.route("/", notebookRoute);

export default app;

