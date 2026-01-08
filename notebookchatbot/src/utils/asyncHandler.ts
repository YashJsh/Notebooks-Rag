import type { Context} from "hono";
import { ZodError } from "zod"
import { APIError } from "./apiError";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const asyncHandler = (fn : (c : Context)=> Promise<any>)=>{
  return async (c : Context)=>{
    try {
      return await fn(c)
    } catch (error : any) {
      if (error instanceof APIError) {
        return c.json(
          {
            success: false,
            message: error.message,
            errors: error.errors,
          },
          error.statusCode as ContentfulStatusCode
        );
      }
      if (error instanceof ZodError) {
        return c.json(
          {
            success: false,
            message: "Validation error",
          },
          400
        );
      }
      return c.json({
        success: false,
        message: error.message
      }, 500)
    }
  }
}

export { asyncHandler };