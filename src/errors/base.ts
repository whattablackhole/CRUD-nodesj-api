export class HttpError {
  message: string;
  statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends HttpError {
  validationErrors?: {
    field: string;
    error: string;
  }[];

  constructor(
    message: string,
    statusCode: number,
    validationErrors?: {
      field: string;
      error: string;
    }[]
  ) {
    super(message, statusCode);
    this.validationErrors = validationErrors;
  }
}
