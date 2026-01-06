import { Hono } from "hono";
import authRoute from "./auth.route";
import notebookRoute from "./notebook.route";
import uploadRoute from "./upload.route";
import chatRoute from "./chat.route";
import { authMiddleware } from "../middleware/auth.middleware";

const protectedRoutes = new Hono();
protectedRoutes.use("/*", authMiddleware);
protectedRoutes.route("/notebooks", notebookRoute);
protectedRoutes.route("/upload", uploadRoute);
protectedRoutes.route("/chat", chatRoute);


const apiRoutes = new Hono();

apiRoutes.route("/auth", authRoute);
apiRoutes.route("/", protectedRoutes);

export default apiRoutes;

