class AppError extends Error {
  constructor(message, errorCode = "App_Error") {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
