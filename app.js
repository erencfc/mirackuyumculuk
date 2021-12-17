const express = require("express");
const pageRoute = require("./routes/pageRoute");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/", pageRoute);

const PORT = process.env.PORT || 80;

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Server started on port ${PORT}`);
});
