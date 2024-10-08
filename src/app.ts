import DbClient from "./database/client.js";
import { createServer } from "http";
import { HttpRouter } from "./routers/router.js";
import { HttpError, ValidationError } from "./errors/base.js";

export default class App {
  private routers: HttpRouter[] = [];

  public async serve(port = 4000, host = "localhost") {
    const dbClient = new DbClient();
    await dbClient.connect("localhost", 4010);

    const server = createServer(async (req, res) => {
      const router = this.routers.find((r) => r.match(req.url));

      if (!router) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`Bad Request! No resource for provided path: ${req.url}\n`);
        return;
      }
      try {
        const response = await router.handle(req, res);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`${response}!\n`);
      } catch (err) {
        if (err instanceof HttpError) {
          if (err instanceof ValidationError) {
            res.writeHead(err.statusCode, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify(err));
          } else {
            res.writeHead(err.statusCode, { "Content-Type": "text/plain" });
            res.end(err.message);
          }
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end(`Internal Server Error.\n`);
        }
       
      }
    });

    server.listen(port, host, () => {
      console.log(`Server is running at http://localhost:${port}/`);
    });
  }

  public registerRouter(router: HttpRouter) {
    this.routers.push(router);
  }
}
