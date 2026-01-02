import { Hono } from "hono";
import { createNotebookController, deleteNotebookController, getNotebook, getNotebookController } from "../controllers/notebook.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const notebookRoute = new Hono();

notebookRoute.get("/notebook", authMiddleware, getNotebookController);
notebookRoute.post("/notebook/create", authMiddleware, createNotebookController);
notebookRoute.get("/notebook/:id", authMiddleware,getNotebook);
notebookRoute.delete("/notebook/:id", authMiddleware, deleteNotebookController);

export default notebookRoute;