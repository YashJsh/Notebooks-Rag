export class APIError extends Error {
    statusCode: number;
    errors: any[];
    success: false;
  
    constructor(
      statusCode: number,
      message = "Something went wrong",
      errors: any[] = []
    ) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      this.success = false;
  
      Error.captureStackTrace(this, this.constructor);
    }
}
  