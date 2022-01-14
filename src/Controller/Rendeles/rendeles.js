const { default: axios } = require("axios");
const { parseString } = require("xml2js");
const { send } = require("../Email/Email");
const { getCustomer } = require("../UNAS/unas");
const { check, validationResult } = require("express-validator");

exports.kuldes = async (req, res) => {
  console.group("---- Order BEGIN ----");

  /**
   * Check if any errors in inputs
   */
  validateData(req, res);
  const errors = validationResult(req);
  if (!errors.length) {
    const email = req.body.email;
    const paymentType = req.body.payment;
    const items = req.body.items;

    // [{ sku: "", Name: "", Unit: "", Quantity: 0 }] ;
    const itemType = req.body.itemType;
    const shippingType = req.body.shipping;
    await getCustomer(email).then(async (data) => {
      console.log("Data: ", data);
      const { token, customer } = data;

      /**
       * Check if customer exists
       */
      if (customer) {
        /**
         * Customer exists
         */
        if (req.path.includes("rendeles")) {
          /**
           * Order
           */
          const body = `<?xml version="1.0" encoding="UTF-8" ?>
                <Orders>
	                <Order>
	                  <Action>add</Action>
		                <Invoice>
			                <Status>0</Status>
		                </Invoice>
		                <Customer>
                      ${getCustomerXml(customer)}
                    </Customer>
                    <Payment>
                      ${getPaymentXml(paymentType)}
                    </Payment>
		                <Comments>
                      ${getCommentXml(itemType)}
                    </Comments>
		                <Shipping>
                      ${getShippingXml(shippingType)}
		                </Shipping>
		                <Items>
                      ${getItemsXml(items)}
		                  </Items>
		                <Status>Feldolgozásra vár</Status>
                  </Order>
                </Orders>`;

          /**
           * Send order
           */
          await sendOrder(token, body).then((result) => {
            if (result.status) {
              /**
               * Succesfully sent order
               */
              send(
                "Rendelés",
                customer.Contact.Name,
                items,
                itemType,
                shippingType
              ).then((emailErr) => {
                /**
                 * Check email sending result
                 */
                if (!emailErr.length) {
                  /**
                   * Email was succesfully sent
                   */
                  res.json({
                    success: true,
                    message: "Order was sent",
                  });

                  console.groupEnd();
                  console.log("---- Order END  ----");
                } else {
                  /**
                   * Failed sending email
                   */
                  res.status(400).json({
                    success: false,
                    message: result.status + " " + emailErr,
                  });

                  console.groupEnd();
                  console.log("---- Order END  ----");
                }
              });
            } else {
              /**
               * Failed to set order
               */
              console.log("Failed to send order: ", result.error);
              res.status(400).json({
                success: false,
                message: result.error,
              });

              console.groupEnd();
              console.log("---- Order END  ----");
            }
          });
        } else if (req.path.includes("arajanlat")) {
          /**
           * Quote
           */
          send(
            "Árajánlat",
            customer.Contact.Name,
            items,
            itemType,
            shippingType
          ).then((emailErr) => {
            /**
             * Check email sending result
             */
            if (!emailErr.length) {
              /**
               * Email was succesfully sent
               */
              res.json({
                success: true,
              });

              console.groupEnd();
              console.log("---- Order END  ----");
            } else {
              /**
               * Failed sending email
               */
              res.status(400).json({
                success: false,
                message: emailErr,
              });

              console.groupEnd();
              console.log("---- Order END  ----");
            }
          });
        }
      } else {
        /**
         * Customer doesn't exist
         */
        console.log("Valid data: ", errors.array());
        res.status(400).json({
          success: false,
          message: "Error in request",
        });

        console.groupEnd();
        console.log("---- Order END  ----");
      }
    });
  } else {
    /**
     * Error in input
     */
    console.log("Valid data: ", errors.array());
    res.status(400).json({
      success: false,
      message: errors.array(),
    });

    console.groupEnd();
    console.log("---- Order END  ----");
  }
};

const validateData = (req, res) => {
  check("email").isEmail().normalizeEmail().trim().escape();
  check("payment").isAlpha().trim().escape();
  check("shipping").isAlpha().trim().escape();
  check("itemType").isAlpha().trim().escape();
  check("items.*.*").not().isEmpty().trim().escape();
  check("items.*.Sku").isAlpha();
  check("items.*.Name").isAlpha();
  check("items.*.Unit").isAlpha();
  check("items.*.Quantity").isNumeric();
};

const getCustomerXml = (customer) => {
  return `
    <Id>${customer.Id}</Id>
    <Email>${customer.Email}</Email>
    <Contact>
      <Name>${customer.Contact.Name}</Name>
      ${getPhoneXml(customer)}
      <Lang>${customer.Contact.Lang}</Lang>
    </Contact>
    <Addresses>
      ${getInviocexml(customer)}
      ${getShippingAddXml(customer)}
    </Addresses>`;
};

const getPhoneXml = (customer) => {
  if (customer.Contact.hasOwnProperty("Phone")) {
    return `<Phone>${customer.Contact.Phone}</Phone><Mobile>${customer.Contact.Phone}</Mobile>`;
  } else if (customer.Contact.hasOwnProperty("Mobile")) {
    return `<Phone>${customer.Contact.Mobile}</Phone><Mobile>${customer.Contact.Mobile}</Mobile>`;
  } else {
    return "";
  }
};

const getInviocexml = (customer) => {
  if (customer.Addresses.hasOwnProperty("Invoice")) {
    const {
      Name,
      ZIP,
      City,
      Street,
      StreetName,
      StreetType,
      StreetNumber,
      Country,
      CountryCode,
    } = customer.Addresses.Invoice;
    return `
    <Invoice>
      <Name>${Name}</Name>
      <ZIP>${ZIP}</ZIP>
      <City>${City}</City>
      <Street>${Street}</Street>
      <StreetName>${StreetName}</StreetName>
      <StreetType>${StreetType}</StreetType>
      <StreetNumber>${StreetNumber}</StreetNumber>
      <Country>${Country}</Country>
      <CountryCode>${CountryCode}</CountryCode>
    </Invoice>`;
  } else {
    const {
      Name,
      ZIP,
      City,
      Street,
      StreetName,
      StreetType,
      StreetNumber,
      Country,
      CountryCode,
    } = customer.Addresses.Shipping;
    return `
    <Invoice>
      <Name>${Name}</Name>
      <ZIP>${ZIP}</ZIP>
      <City>${City}</City>
      <Street>${Street}</Street>
      <StreetName>${StreetName}</StreetName>
      <StreetType>${StreetType}</StreetType>
      <StreetNumber>${StreetNumber}</StreetNumber>
      <Country>${Country}</Country>
      <CountryCode>${CountryCode}</CountryCode>
    </Invoice>`;
  }
};

const getShippingAddXml = (customer) => {
  const {
    Name,
    ZIP,
    City,
    Street,
    StreetName,
    StreetType,
    StreetNumber,
    Country,
    CountryCode,
  } = customer.Addresses.Shipping;
  return `
  <Shipping>
    <Name>${Name}</Name>
    <ZIP>${ZIP}</ZIP>
    <City>${City}</City>
    <Street>${Street}</Street>
    <StreetName>${StreetName}</StreetName>
    <StreetType>${StreetType}</StreetType>
    <StreetNumber>${StreetNumber}</StreetNumber>
    <Country>${Country}</Country>
    <CountryCode>${CountryCode}</CountryCode>
  </Shipping>`;
};

const getPaymentXml = (paymentType) => {
  if (paymentType === "cash") {
    return `
    <Id>563219</Id>
    <Name>Készpénzzel/Bankkártyával a helyszínen</Name>
    <Type>cash</Type>`;
  } else if (paymentType === "bank") {
    return `
    <Id></Id>
    <Name></Name>
    <Type>bank</Type>`;
  }
};

const getCommentXml = (type) => {
  if (type === "lapszabo") {
    return `
    <Comment>
      <Type>customer</Type>
      <Text>Lapszabászati rendelés</Text>
    </Comment>`;
  } else if (type === "fiok-elolap") {
    return `
    <Comment>
      <Type>customer</Type>
      <Text>Fiók előlap rendelés</Text>
    </Comment>`;
  }
};

const getShippingXml = (type) => {
  if (type === "szemelyes") {
    return `
    <Id>563216</Id>
    <Name>Személyes átvétel az üzletünkben</Name>`;
  }
};

/**
 *
 * @param {array} items
 * @return {object}
 */
const getItemsXml = (items) => {
  let string = "";
  items.map((item, index) => {
    let xml = `
    <Item>
      <Sku>${item.Sku}</Sku>
      <Name>${item.Name}</Name>
      <Unit>${item.Unit}</Unit>
      <Quantity>${item.Quantity}</Quantity>
      <PriceNet>10</PriceNet>
      <PriceGross>10</PriceGross> 
      <Vat>27%</Vat>
    </Item>`;
    string += xml;
  });
  return string;
};

const sendOrder = async (token, body) => {
  let status;
  let error = null;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  await axios
    .post("https://api.unas.eu/shop/setOrder", body, config)
    .then((res) => {
      parseString(res.data, (err, result) => {
        if (err) {
          console.log("Xml parsing failed: ", err);
          return { err, status };
        }

        console.log("Order status: ", status);

        const orders = result.Orders.Order;
        orders.map((item, index) => {
          if (item.Status[0] === "ok") {
            status = item.Status[0];
          } else {
            error = item.Status[0];
          }
        });

        status = result.Orders.Order[0].Status[0];
      });
    })
    .catch((err) => {
      console.log("Order failed to send: ", err);
      error = err;
    });
  return { error, status };
};
