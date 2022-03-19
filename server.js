const http = require("http");
const app = require("./app");
// const cluster = require("cluster");
// const os = require("os");
const PORT = process.env.PORT || 1500;

const server = http.createServer(app);

// if (cluster.isMaster) {
//   console.log("master process started");
//   const numWorkers = os.cpus().length;
//   for (let i = 0; i < numWorkers; i++) {
//     cluster.fork();
//   }
// } el
//   console.log("worker process started");
// }
server.listen(PORT, () => {
  console.log(`server listening on port::: ${process.env.host}${PORT}`);
});
