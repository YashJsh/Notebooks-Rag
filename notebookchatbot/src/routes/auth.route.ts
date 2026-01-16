import { Hono, type Context } from "hono";
import { signInController, signUpController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { APIResponse } from "../utils/apiResponse";

const authRoute = new Hono();

/**
 * @route POST /api/v1/auth/signin
 * @description Sign in with email and password
 * @access Public
 */
authRoute.post("/signin", signInController);

/**
 * @route POST /api/v1/auth/signup
 * @description Sign up with email and password
 * @access Public
 */

authRoute.post("/signup", signUpController);


authRoute.get("/me", authMiddleware, async (c : Context) => {
    const id = await c.get("id");
    const email = await c.get("email");
  return c.json(new APIResponse({id, email}, "User authenticated"));
});


export default authRoute;