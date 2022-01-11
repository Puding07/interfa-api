"use strict";

const server = require("./server");

const Cabin = require("cabin");

const cabin = new Cabin();
const PORT = process.env.PORT || 8080;
server.use(cabin.middleware);
server.listen(PORT, () => {
  console.log(`App listening on port:${PORT} ✅`);
});