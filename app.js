const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "pug");
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`The application is running on port ${port}`);
});
