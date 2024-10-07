import { spawn } from "node:child_process";
import path from "node:path";

const dirname = import.meta.dirname;

const dbProcess = spawn("node", [
  "--no-warnings=ExperimentalWarning",
  "--loader",
  "ts-node/esm",
  path.resolve(dirname, "./start-db.ts"),
]);

dbProcess.stdout.on("data", (data) => {
  console.log(`DB server stdout: ${data}`);
});

dbProcess.stderr.on("data", (data) => {
  console.error(`DB server stderr: ${data}`);
});

dbProcess.on("close", (code) => {
  console.log(`DB server exited with code ${code}`);
});

const clusterProcess = spawn("node", [
  "--no-warnings=ExperimentalWarning",
  "--loader",
  "ts-node/esm",
  path.resolve(dirname, "./cluster.ts"),
]);

clusterProcess.stdout.on("data", (data) => {
  console.log(`Clustered app stdout: ${data}`);
});

clusterProcess.stderr.on("data", (data) => {
  console.error(`Clustered app stderr: ${data}`);
});

clusterProcess.on("close", (code) => {
  console.log(`Clustered app exited with code ${code}`);
});
