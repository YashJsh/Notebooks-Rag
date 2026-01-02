import { Hono } from "hono";
import { signInController, signUpController } from "../controllers/auth.controller";

const authRoute = new Hono();

authRoute.post("/signin", signInController);
authRoute.post("/signup", signUpController);

export default authRoute;