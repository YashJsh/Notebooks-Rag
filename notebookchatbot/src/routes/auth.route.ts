import { Hono } from "hono";
import { signInController, signUpController } from "../controllers/auth.controller";

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

export default authRoute;