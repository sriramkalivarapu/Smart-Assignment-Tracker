const express = require("express");
const fs = require("fs");

const app = express();

const dataFile = "./data/assignments.json";

let assignments = JSON.parse(fs.readFileSync(dataFile));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
    res.send("MY NEW SERVER IS WORKING");
});

app.get("/api/assignments", (req, res) => {
    res.json(assignments);
});

app.post("/add-assignment", (req, res) => {

    const newAssignment = {
        id: Date.now(),
        subject: req.body.subject,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        status: "Pending"
    };

    assignments.push(newAssignment);

    fs.writeFileSync(
        dataFile,
        JSON.stringify(assignments, null, 2)
    );

    console.log(newAssignment);

    res.send("Assignment received successfully!");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});