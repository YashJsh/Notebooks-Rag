import { Hono } from "hono";
import { cors } from 'hono/cors'
import dataRoute from "./routes/upload.route";
import authRoute from "./routes/auth.route";
import notebookRoute from "./routes/notebook.route";
import chatRoute from "./routes/chat.route";

const app = new Hono();

app.use('/*', cors({
    origin : process.env.CORS!
}));

app.route("/api",dataRoute);
app.route("/auth", authRoute);
app.route("/", notebookRoute);
app.route("/chat", chatRoute);

export default app;

