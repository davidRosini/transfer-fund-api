import App from "./app";
import envs from "./config/config.env";

console.log("Starting app...");
const app = new App(envs.appHost, envs.appPort);

app.connectToTheDatabase(envs.dbHost, envs.dbPort);
app.setupQueue(envs.queueHost, envs.queuePort, envs.queueUser, envs.queuePass);
app.startServer();
