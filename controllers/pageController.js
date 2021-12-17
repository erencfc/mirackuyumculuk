const request = require("request");
const convert = require("xml-js");
const xml2js = require("xml2js");

const URL = "http://data.altinkaynak.com/DataService.asmx?wsdl";

let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:data="http://data.altinkaynak.com/">
<soapenv:Header>
   <data:AuthHeader>
      <!--Optional:-->
      <data:Username>AltinkaynakWebServis</data:Username>
      <!--Optional:-->
      <data:Password>AltinkaynakWebServis</data:Password>
   </data:AuthHeader>
</soapenv:Header>
<soapenv:Body>
   <data:GetCurrency/>
</soapenv:Body>
</soapenv:Envelope>`;

var options = (func) => {
    return {
        url: URL,
        method: "POST",
        body: xml,
        headers: {
            "Content-Type": "text/xml;charset=UTF-8",
            "Accept-Encoding": "gzip,deflate",
            "Content-Length": xml.length,
            SOAPAction: `http://data.altinkaynak.com/${func}`,
        },
    };
};

exports.getIndexPage = (req, res) => {
    var currencies;

    function currency(currencies, currency = null) {
        if (currency === null) {
            return currencies;
        } else {
            return currencies.filter((c) => c["Kod"]["_text"] == currency);
        }
    }

    new Promise((resolve, reject) => {
        request(options("GetCurrency"), async (error, response, body) => {
            if (error) return reject(error);
            var parser = await new xml2js.Parser({
                explicitArray: false,
                trim: true,
            });
            await parser.parseString(body, async (err, result) => {
                var XML =
                    result["soap:Envelope"]["soap:Body"]["GetCurrencyResponse"][
                        "GetCurrencyResult"
                    ];
                var result = await convert.xml2json(XML, {
                    compact: true,
                    spaces: 4,
                });
                var parsedResult = await JSON.parse(result);
                currencies = parsedResult["Kurlar"]["Kur"];
                resolve(currency(currencies));
            });
        });
    })
        .then((currencies) => {
            currencies = currencies;
            res.status(200).render("index", {
                currencies: currencies,
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({
                status: "fail",
                error,
            });
        });

    // res.status(200).render("index");
};
