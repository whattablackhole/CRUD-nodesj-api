import App from "./app.js";
import DataBase from "./database/db.js";

const app = new App();
const db = new DataBase();

app.serve();
db.serve();