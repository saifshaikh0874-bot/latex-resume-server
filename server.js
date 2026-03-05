const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/compile", (req, res) => {

    const latex = req.body.latex;

    fs.writeFileSync("resume.tex", latex);

    exec("pdflatex resume.tex", (err) => {

        if (err) {
            console.log(err);
            return res.send("error");
        }

        res.send("ok");

    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});