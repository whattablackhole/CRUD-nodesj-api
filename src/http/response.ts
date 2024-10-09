export default class HttpResponse {
    public data?: unknown;
    public statusCode: number;

    constructor(statusCode: number, data?: unknown) {
        this.data = data;
        this.statusCode = statusCode;
    }
}