const request = require("request");
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

var options = {
    url: "http://data.altinkaynak.com/DataService.asmx?wsdl",
    method: "POST",
    body: xml,
    headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "Accept-Encoding": "gzip,deflate",
        "Content-Length": xml.length,
        SOAPAction: "http://data.altinkaynak.com/GetCurrency",
    },
};

var convert = require("xml-js");

let callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
        var xml2js = require("xml2js");
        var parser = new xml2js.Parser({ explicitArray: false, trim: true });
        parser.parseString(body, (err, result) => {
            var USD =
                result["soap:Envelope"]["soap:Body"]["GetCurrencyResponse"][
                    "GetCurrencyResult"
                ];
            var result = convert.xml2json(USD, { compact: true, spaces: 4 });
            var parsedResult = JSON.parse(result);
            console.log(parsedResult["Kurlar"]["Kur"]);
        });
    }
};
request(options, callback);
