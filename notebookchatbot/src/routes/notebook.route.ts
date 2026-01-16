import { Hono } from "hono";
import { createNotebookController, deleteNotebookController, getNotebook, getNotebookController, getSource } from "../controllers/notebook.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const notebookRoute = new Hono();

/**
 * @route GET /api/v1/notebooks
 * @description Get all notebooks for authenticated user
 * @access Private
 */
notebookRoute.get("/", getNotebookController);

/**
 * @route POST /api/v1/notebooks/create
 * @description Create a new notebook
 * @access Private
 */
notebookRoute.post("/create", createNotebookController);

/**
 * @route GET /api/v1/notebooks/:id
 * @description Get a notebook by ID
 * @access Private
 */
notebookRoute.get("/:id",getNotebook);

/**
 * @route DELETE /api/v1/notebooks/:id
 * @description Delete a notebook by ID
 * @access Private
 */
notebookRoute.delete("/:id", deleteNotebookController);

/**
 * @route GET /api/v1/notebooks/:id/sources
 * @description Give Source of the notebook.
 * @access Private
 */
notebookRoute.get("/:id/sources", getSource);

export default notebookRoute;