export default class HttpResponse {
  public data?: any;
  public message?: string;
  public statusCode: number;

  constructor(statusCode: number, message?: string, data?: unknown) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
