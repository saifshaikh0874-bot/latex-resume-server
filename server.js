const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

/* COMPILE LATEX */

app.post("/compile", (req, res) => {

    const latex = req.body.latex;

    fs.writeFileSync("resume.tex", latex);

    exec("pdflatex -interaction=nonstopmode -halt-on-error resume.tex", (err, stdout, stderr) => {

        if (err) {
            console.log(stderr);
            return res.status(500).send("LaTeX compile error");
        }

        /* check if pdf actually created */

        if (!fs.existsSync("resume.pdf")) {
            return res.status(500).send("PDF generation failed");
        }

        res.send("compiled");

    });

});

/* SERVE PDF */

app.get("/resume.pdf", (req, res) => {

    const file = path.join(__dirname, "resume.pdf");

    if (!fs.existsSync(file)) {
        return res.status(404).send("PDF not found");
    }

    res.sendFile(file);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
