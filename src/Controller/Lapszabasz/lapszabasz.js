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
