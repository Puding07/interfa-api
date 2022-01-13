const { send } = require("../Email/Email");

exports.kuldes = (req, res) => {
  send()
    .then(() => {
      res.json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err,
      });
    });
};
