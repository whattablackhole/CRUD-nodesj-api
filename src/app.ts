import DbClient from "./database/client.js";
import { createServer } from "http";
import { HttpRouter } from "./routers/router.js";

export default class App {
  private routers: HttpRouter[] = [];
  
  public async serve(port = 4000, host = "localhost") {
    const dbClient = new DbClient();
    await dbClient.connect("localhost", 4010);

    const server = createServer(async (req, res) => {
      const router = this.routers.find((r) => r.match(req.url));
      
      if (!router) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Bad Request!\n");
        return;
      }
      const response = await router.handle(req, res);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`${response}!\n`);
    });

    server.listen(port, host, () => {
      console.log(`Server is running at http://localhost:${port}/`);
    });
  }

  public registerRouter(router: HttpRouter) {
    this.routers.push(router);
  }
}
