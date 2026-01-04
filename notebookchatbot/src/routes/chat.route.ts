import { Hono } from "hono";
import { chatController } from "../controllers/chat.controller";

const chatRoute = new Hono();

chatRoute.post("/chat", chatController);

export default chatRoute;