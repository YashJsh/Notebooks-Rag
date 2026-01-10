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
 * @route POST /api/v1/upload/:id/pdf
 * @description Upload pdf data to a specific notebook
 * @access Private
 */
dataRoute.post("/:id/pdf", pdfUpload);

/**
 * @route POST /api/v1/upload/:id/website
 * @description Uploads website data to the document inside notebook
 * @access Private
 */
dataRoute.post("/:id/website", webSiteUpload);

export default dataRoute;


