const fs = require("fs");
const path = require("path");
const termekek = "./termekek.json";

exports.adatok = (req, res) => {
  const adatok = JSON.parse(fs.readFileSync(path.resolve(__dirname, termekek)));

  res.json({ status: "success", data: adatok });
};

exports.frissites = (req, res) => {
  const adatok = req.body.adatok;

  if (adatok) {
    fs.writeFileSync(path.resolve(__dirname, termekek), JSON.stringify(adatok));
    res.json({
      status: "success",
      message: "Lapszabászati adatok frissítve",
    });
  } else {
    res.json({
      status: "failed",
      message: "A megadott lapszabászati adatok helytelenek",
    });
  }
};

exports.csvFile = (elemek) => {
  const dataSource = {
    columns: [
      "Anyagnév",
      "Anyag kód",
      "Vevő neve",
      "Hossz",
      "Szélesség",
      "Darabszám",
      "Szálirány",
      "Vékony élzáró neve",
      "Vékony él",
      "Vastag élzáró neve",
      "Vastag él",
      "Megjegyzés",
    ],
    data: [
      /*
         * TESZT ADATOK
        {
          name: "valamilyen termék lényeg, hogy ékezetes",
          cikk: "lsblk8",
          customer: "Vásárló",
          width: "250",
          length: "1525",
          piece: "2",
          threadDir: "true",
          thinEdgeColor: "Saját",
          thinEdgePlace: "1-0",
          thickEdgeColor: "Saját",
          thickEdgePlace: "-",
          comment: "",
        },
        */
    ],
  };

  let termekObj = {
    name: termekNeve,
    cikk: cikk,
    customer: customer,
    width: width,
    length: length,
    piece: piece,
    threadDir: threadDir,
    thinEdgeColor: thinEdgeColor,
    thinEdgePlace: thinEdgePlace !== "0-0" ? thinEdgePlace : "-",
    thickEdgeColor: thickEdgeColor,
    thickEdgePlace: thickEdgePlace !== "0-0" ? thickEdgePlace : "-",
    shortEdgeColor: shortEdgeColor,
    comment: comment,
  };
};
