import { Hono } from "hono";
import { chatController } from "../controllers/chat.controller";

const chatRoute = new Hono();

/**
 * @route POST /api/v1/chat
 * @description Chat with the notebook
 * @access Private
 */
chatRoute.post("/", chatController);

export default chatRoute;