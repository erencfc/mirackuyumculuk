const express = require("express");
const https = require("https");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  let doviz = [];
  let altin = [];

  new Promise((resolve, reject) => {
    https.get("https://ozankur.com/dovizpagedatabackup.php", (response) => {
      let data = [];

      response.on("data", (d) => {
        data.push(d);
      });

      response.on("end", () => {
        const parsed = JSON.parse(Buffer.concat(data).toString()).data;
        const currencies = Object.keys(parsed);

        for (let i = 0; i < currencies.length; i++) {
          if (
            Object.values(parsed)[i].code == "EUR" ||
            Object.values(parsed)[i].code == "USD"
          ) {
            let obj = {
              birim: Object.values(parsed)[i].code,
              alis: Object.values(parsed)[i].alis,
              satis: Object.values(parsed)[i].satis,
            };
            doviz.push(obj);
            resolve("Başarılı");
          }
        }
      });
    });

    https.get("https://ozankur.com/goldpagedatabackup.php", (response) => {
      let data = [];

      response.on("data", (d) => {
        data.push(d);
      });

      response.on("end", () => {
        const parsed = JSON.parse(Buffer.concat(data).toString()).data;
        const currencies = Object.keys(parsed);

        for (let i = 0; i < currencies.length; i++) {
          if (
            Object.values(parsed)[i].code == "22 HURDA" ||
            Object.values(parsed)[i].code == "995 HAS"
          ) {
            let obj = {
              birim: Object.values(parsed)[i].code,
              alis: Object.values(parsed)[i].alis,
              satis: Object.values(parsed)[i].satis,
            };
            altin.push(obj);
          }
        }
      });
    });
  }).then(() => {
    setTimeout(() => {
      res.status(200).render("index", {
        doviz,
        altin,
      });
    }, 10);
  });
});

app.get("/doviz", (req, res) => {
  https.get("https://ozankur.com/dovizpagedatabackup.php", (response) => {
    let data = [];

    response.on("data", (d) => {
      data.push(d);
    });

    response.on("end", () => {
      const parsed = JSON.parse(Buffer.concat(data).toString()).data;
      const currencies = Object.keys(parsed);

      let values = [];

      for (let i = 0; i < currencies.length; i++) {
        if (
          Object.values(parsed)[i].code == "EUR/USD" ||
          Object.values(parsed)[i].code == "GBP/USD"
        )
          continue;

        let obj = {
          birim: Object.values(parsed)[i].code,
          alis: Object.values(parsed)[i].alis,
          satis: Object.values(parsed)[i].satis,
        };
        values.push(obj);
      }

      res.status(200).render("doviz", {
        values,
      });
    });
  });
});

app.get("/altin", (req, res) => {
  https.get("https://ozankur.com/goldpagedatabackup.php", (response) => {
    let data = [];

    response.on("data", (d) => {
      data.push(d);
    });

    response.on("end", () => {
      const parsed = JSON.parse(Buffer.concat(data).toString()).data;
      const currencies = Object.keys(parsed);

      let values = [];

      for (let i = 0; i < currencies.length; i++) {
        if (Object.values(parsed)[i].code == "GÜMÜŞ KÜLÇE") {
          continue;
        }

        let obj = {
          birim: Object.values(parsed)[i].code,
          alis: Object.values(parsed)[i].alis,
          satis: Object.values(parsed)[i].satis,
        };
        values.push(obj);
      }

      res.status(200).render("altin", {
        values,
      });
    });
  });
});

const PORT = process.env.PORT || 80;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server started on port ${PORT}`);
});
