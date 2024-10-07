import cluster from "cluster";
import App from "../app.js";
import http from "node:http";
import { availableParallelism } from "os";

const numCPUs = availableParallelism();
const basePort = 4000;
const workerBasePort = 4001;
const workerAmount = numCPUs - 1;

if (cluster.isPrimary) {
  for (let i = 0; i < workerAmount; i++) {
    cluster.fork({ WORKER_PORT: workerBasePort + i });
  }

  let workerIndex = 0;

  const loadBalancer = http.createServer((req, res) => {
    const workerPort = (workerIndex % workerAmount) + workerBasePort;
    workerIndex++;

    const options = {
      hostname: "localhost",
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    console.log(`Proxying request to http://localhost:${workerPort}`);

    const proxyRequest = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyRequest, { end: true });

    proxyRequest.on("error", (err) => {
      console.error(`Error with proxy request: ${err.message}`);
      res.writeHead(502);
      res.end("Bad Gateway");
    });
  });

  loadBalancer.listen(basePort, () => {
    console.log(`Load balancer is listening on http://localhost:${basePort}/`);
  });

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork({ WORKER_PORT: worker.process.spawnargs[0] });
  });
} else {
  const port = Number.parseInt(process.env.WORKER_PORT);
  new App().serve(port);
}
