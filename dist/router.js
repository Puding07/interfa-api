"use strict";

//initialize express router
const router = require("express").Router();

const root = require("./Controller/Root/root");

const lapszabasz = require("./Controller/Lapszabasz/lapszabasz");

const fiok = require("./Controller/Fiok/fiok");

const rendeles = require("./Controller/Rendeles/rendeles");

const arajanlat = require("./Controller/Arajanlat/arajanlat");
/**
 * @swagger
 * /api:
 *  get:
 *    tags:
 *    - Root
 *    summary: API tesztelése
 *    responses:
 *      200:
 *        description: Returns String
 */


router.route("/").get(root.response);
/**
 * @swagger
 * /api/lapszabaszat:
 *  get:
 *    tags:
 *    - Lapszabászat
 *    summary: Lapszabászati adatok kinyerése
 *    responses:
 *      200:
 *        description: Returns Object
 *  post:
 *    tags:
 *    - Lapszabászat
 *    summary: Lapszabászati adatok frissítése
 *    responses:
 *      200:
 *        description: Returns Object
 */

router.route("/lapszabaszat").get(lapszabasz.adatok).post(lapszabasz.frissites);
/**
 * @swagger
 * /api/fiokelolap:
 *  get:
 *    tags:
 *    - Fiók előlap
 *    summary: Fiók előlap adatok kinyerése
 *    responses:
 *      200:
 *        description: Returns Object
 */

router.route("/fiokelolap").get(fiok.adatok);
/**
 * @swagger
 * /api/rendeles:
 *  post:
 *    tags:
 *    - Rendelés
 *    summary: Rendelés leadása a webshopba
 *    responses:
 *      200:
 *        description: Returns Object
 */

router.route("/rendeles").post(rendeles.kuldes);
/**
 * @swagger
 * /api/arajanlat:
 *  post:
 *    tags:
 *    - Árajánlat
 *    summary: Árajánlat kűldése
 *    responses:
 *      200:
 *        description: Returns Object
 */

router.route("/arajanlat").post(arajanlat.kuldes);
module.exports = router;