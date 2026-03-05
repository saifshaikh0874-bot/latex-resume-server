const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

/* HOME PAGE */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

/* COMPILE LATEX */

app.post("/compile", (req, res) => {

    const latex = req.body.latex;

    fs.writeFileSync("resume.tex", latex);

    exec("pdflatex -interaction=nonstopmode resume.tex", (err) => {

        if (err) {
            console.log(err);
            return res.status(500).send("compile error");
        }

        res.send("compiled");

    });

});

/* SERVE PDF */

app.get("/resume.pdf", (req, res) => {

    const filePath = path.join(__dirname, "resume.pdf");

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("PDF not found");
    }

});

/* PORT */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
