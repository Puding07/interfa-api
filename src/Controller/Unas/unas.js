const { default: axios } = require("axios");
const parseString = require("xml2js").parseString;
require("dotenv").config();

const apiKey = process.env.API_KEY || "";
let token = null;
let tokenExpire = new Date("1970");
let customer = null;
let phoneName = "";

const checkTokenExpiration = () => {
  if (new Date() > tokenExpire) {
    return true;
  }
  return false;
};

const auth = async () => {
  const body = `<?xml version="1.0" encoding="UTF-8" ?>
	<Params>
		<ApiKey>${apiKey}</ApiKey>
	</Params>`;

  await axios.post("https://api.unas.eu/shop/login", body).then((res) => {
    parseString(res.data, (err, result) => {
      if (err) {
        console.log("Error parsing xml: ", err);
        return;
      }
      token = result.Login.Token[0];
      tokenExpire = new Date(String(result.Login.Expire));
    });
  });
};

const getCustomerData = async (email) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
  <Params>
        <Email>${email}</Email>
  </Params>`;
  await axios
    .post("https://api.unas.eu/shop/getCustomer", body, config)
    .then((res) => {
      return parseString(res.data, (err, result) => {
        if (err) {
          console.log("Error parsing xml: ", err);
          return;
        }

        // console.log("XML result: ", result);
        if (result.Customers.hasOwnProperty("Customer")) {
          const pure = result.Customers.Customer[0];
          const Contact = pure.Contact[0];

          if (pure.Contact[0].hasOwnProperty("Phone")) {
            phoneName = "Phone";
          } else if (pure.Contact[0].hasOwnProperty("Mobile")) {
            phoneName = "Mobile";
          } else {
            phoneName = "";
          }

          customer = {
            Id: pure.Id[0],
            Email: pure.Email[0],
            Contact: {
              Name: pure.Contact[0].Name[0],
              ...(phoneName && {
                [phoneName]: Contact[phoneName][0] || "+36201234567",
              }),
              Lang: pure.Contact[0].Lang[0] || "hu",
            },
            Addresses: {
              Invoice: {
                Name: pure.Addresses[0].Invoice[0].Name[0],
                ZIP: pure.Addresses[0].Invoice[0].ZIP[0],
                City: pure.Addresses[0].Invoice[0].City[0],
                Street: pure.Addresses[0].Invoice[0].Street[0],
                StreetName: pure.Addresses[0].Invoice[0].StreetName[0],
                StreetType: pure.Addresses[0].Invoice[0].StreetType[0],
                StreetNumber: pure.Addresses[0].Invoice[0].StreetNumber[0],
                Country: pure.Addresses[0].Invoice[0].Country[0],
                CountryCode: pure.Addresses[0].Invoice[0].CountryCode[0],
                TaxNumber: pure.Addresses[0].Invoice[0].TaxNumber[0],
                EUTaxNumber: pure.Addresses[0].Invoice[0].EUTaxNumber[0],
              },
              Shipping: {
                Name: pure.Addresses[0].Shipping[0].Name[0],
                ZIP: pure.Addresses[0].Shipping[0].ZIP[0],
                City: pure.Addresses[0].Shipping[0].City[0],
                Street: pure.Addresses[0].Shipping[0].Street[0],
                StreetName: pure.Addresses[0].Shipping[0].StreetName[0],
                StreetType: pure.Addresses[0].Shipping[0].StreetType[0],
                StreetNumber: pure.Addresses[0].Shipping[0].StreetNumber[0],
                Country: pure.Addresses[0].Shipping[0].Country[0],
                CountryCode: pure.Addresses[0].Shipping[0].CountryCode[0],
              },
            },
          };
          // console.log("Customer: ", customer);
          return customer;
        }
      });
    });

  return customer;
};

exports.getCustomer = async (email) => {
  if (checkTokenExpiration()) {
    await auth().then(async () => {
      customer = null;
      await getCustomerData(email);
    });
    return { token, customer, message: "success" };
  } else if (token) {
    customer = null;
    await getCustomerData(email);
    return { token, customer, message: "success" };
  } else {
    customer = null;
    return { token, customer, message: "failed" };
  }
};
