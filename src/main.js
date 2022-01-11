const server = require("./server");
const Cabin = require("cabin");
require("dotenv").config();

const cabin = new Cabin();
const PORT = process.env.PORT || 8080;

server.use(cabin.middleware);
server.listen(PORT, () => {
  console.log(`App listening on port:${PORT} ✅`);
});
