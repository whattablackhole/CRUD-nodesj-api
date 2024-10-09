import { createServer, ServerResponse } from "http";
import { HttpRouter } from "./routers/router.js";
import { HttpError, ValidationError } from "./errors/base.js";

export default class App {
  private routers: HttpRouter[] = [];

  public async serve(port = 4000, host = "localhost") {
    const server = createServer(async (req, res) => {
      const router = this.routers.find((r) => r.match(req.url));

      if (!router) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`Bad Request! No resource for provided path: ${req.url}\n`);
        return;
      }

      try {
        const response = await router.handle(req);
        res.writeHead(response.statusCode, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(response));
      } catch (err) {
        if (err instanceof HttpError) {
          res.writeHead(err.statusCode, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(err));
        } else {
          console.error(err);
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
