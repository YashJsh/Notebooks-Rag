import { Hono } from "hono";
import { pdfUpload, textUpload, webSiteUpload } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const dataRoute = new Hono();

/**
 * @route POST /api/v1/upload/:id/text
 * @description Upload text data to a specific notebook
 * @access Private
 */
dataRoute.post("/:id/text", textUpload);

/**
 * @route POST /api/v1/upload/pdf
 * @description Upload pdf data to a specific notebook
 * @access Private
 */
dataRoute.post("/pdf", pdfUpload);

/**
 * @route POST /api/v1/upload/website
 * @description Uploads website data to the document inside notebook
 * @access Private
 */
dataRoute.post("/website", webSiteUpload);

export default dataRoute;


