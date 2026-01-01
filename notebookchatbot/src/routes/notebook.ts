import { Hono } from "hono";
import { createNotebookController, getNotebookController } from "../controllers/notebook.controller";

const notebookRoute = new Hono();

notebookRoute.get("/notebook", getNotebookController);
notebookRoute.post("/notebook/create", createNotebookController);

export default notebookRoute;