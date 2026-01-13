import { Hono } from "hono";
import { chatController } from "../controllers/chat.controller";

const chatRoute = new Hono();

/**
 * @route POST /api/v1/chat/notebookID
 * @description Chat with the notebook
 * @access Private
 */
chatRoute.post("/:notebookId", chatController);

export default chatRoute;