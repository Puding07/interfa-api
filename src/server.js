const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const helmet = require("helmet");
const routes = require("./router");

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Interfa API",
      version: "1.0.0",
      description: "Ez az interfa.hu API végpontját szolgáló dokumentáció.",
    },
  },
  apis: ["./src/router.js"], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(
  cors({
    //origin: "https://interfa.hu",
    optionsSuccessStatus: 200,
  })
);
app.use(helmet());
app.use(bodyParser.json());
app.use("/api", routes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
