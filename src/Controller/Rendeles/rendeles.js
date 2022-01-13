const { default: axios } = require("axios");
const { parseString } = require("xml2js");
const { auth, getCustomer } = require("../UNAS/unas");

const getPhoneXml = (customer) => {
  if (customer.Contact.hasOwnProperty("Phone")) {
    return `<Phone>${customer.Contact.Phone}</Phone>`;
  } else if (customer.Contact.hasOwnProperty("Mobile")) {
    return `<Mobile>${customer.Contact.Phone}</Mobile>`;
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

const getShippingXml = (customer) => {
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
  } = customer;
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
      ${getShippingXml(customer)}
    </Addresses>`;
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
      <Text>TESZT VÁSÁRLÁS</Text>
    </Comment>`;
  } else if (type === "fiok-elolap") {
    return `
    <Comment>
      <Type>customer</Type>
      <Text>TESZT VÁSÁRLÁS</Text>
    </Comment>`;
  }
};

const sendOrder = async (token, body) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  await axios
    .post("https://api.unas.eu/shop/setOrder", body, config)
    .then((res) => {
      parseString(res.data, (err, result) => {
        const status = result.Orders[0].Order[0].Status[0];
        return status === "ok" ? true : status;
      });
    });
};

exports.kuldes = (req, res) => {
  // const adatok = req.body.adatok;
  const email = "";
  const paymentType = "";
  const items = [{ sku: "" }];
  const itemType = "";
  const { token, customer } = getCustomer(email);

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
			<Comment>
				<Type>customer_shipping</Type>
				<Text>NEM KELL SZÁLLÍTANI</Text>
			</Comment>
		</Comments>
		<Shipping>
			<Id>563216</Id>
			<Name>Személyes átvétel az üzletünkben</Name>
		</Shipping>
		<Items>
			<Item>
				<Sku>lsmli1540m38</Sku>
				<Name>Munkalap I-1540 Himalaya white nanotech 38 mm-es</Name>
				<Unit>fm</Unit>
				<Quantity>0.1</Quantity>
				<PriceNet>22752</PriceNet>
				<PriceGross>28895</PriceGross> 
				<Vat>27%</Vat>
			</Item>
		</Items>
		<Status>Feldolgozásra vár</Status>
	</Order>
</Orders>`;

  sendOrder(token, body).then((status) => {
    if (status) {
      res.json({
        success: true,
      });
    } else {
      res.status(400).json({
        success: false,
        message: status,
      });
    }
  });
};
