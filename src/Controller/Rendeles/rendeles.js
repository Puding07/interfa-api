const { auth, getCustomer } = require("../UNAS/unas");

exports.kuldes = (req, res) => {
  // const adatok = req.body.adatok;

  getCustomer();

  res.json({
    success: true,
  });
};
