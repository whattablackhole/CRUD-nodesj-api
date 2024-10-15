import { createServer, Server } from "http";
import { HttpRouter } from "./routers/router.js";
import { HttpError } from "./errors/base.js";
import HttpResponse from "./http/response.js";

export default class App {
  private routers: HttpRouter[] = [];
  private server: Server;

  public async serve(port = 4000, host = "localhost") {
    const server = createServer(async (req, res) => {
      try {
        const router = this.routers.find((r) => r.match(req.url));
        if (!router) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify(
              new HttpResponse(404, `No resource for provided path: ${req.url}`)
            )
          );
          return;
        }

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
    this.server = server;
  }

  public async stop() {
    return new Promise<void>((res, rej) => {
      this.server.close((err) => {
        if (err) {
          console.debug(err);
          return rej(err);
        }

        res();
      });
    });
  }

  public registerRouter(router: HttpRouter) {
    this.routers.push(router);
  }
}
