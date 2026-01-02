import { Hono } from "hono";
import { cors } from 'hono/cors'
import dataRoute from "./src/routes/upload.route";
import authRoute from "./src/routes/auth.route";
import notebookRoute from "./src/routes/notebook.route";

const app = new Hono();
app.use('/*', cors());

app.route("/api",dataRoute);
app.route("/auth", authRoute);
app.route("/", notebookRoute);

export default app;

