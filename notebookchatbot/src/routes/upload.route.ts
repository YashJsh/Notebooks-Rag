import { Hono } from "hono";
import { pdfUpload, textUpload, webSiteUpload } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const dataRoute = new Hono();

//Here id is of notebook Id
dataRoute.post("/upload/:id/text", authMiddleware, textUpload);
dataRoute.post("/upload/pdf", authMiddleware, pdfUpload);
dataRoute.post("/upload/website", authMiddleware, webSiteUpload);

export default dataRoute;


