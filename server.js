const express = require("express");
const fs = require("fs");

const app = express();

const dataFile = "./data/assignments.json";

let assignments = JSON.parse(fs.readFileSync(dataFile));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Allow JSON data from JavaScript
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
    res.send("MY NEW SERVER IS WORKING");
});

// Get all assignments
app.get("/api/assignments", (req, res) => {
    res.json(assignments);
});

// Add assignment
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

// Mark assignment as completed
app.put("/api/assignments/:id/complete", (req, res) => {

    const id = Number(req.params.id);

    const assignment = assignments.find(a => a.id === id);

    if (!assignment) {
        return res.status(404).json({
            message: "Assignment not found"
        });
    }

    assignment.status = "Completed";

    fs.writeFileSync(
        dataFile,
        JSON.stringify(assignments, null, 2)
    );

    res.json({
        message: "Assignment completed successfully"
    });
});

// Delete assignment
app.delete("/api/assignments/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = assignments.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Assignment not found"
        });
    }

    assignments.splice(index, 1);

    fs.writeFileSync(
        dataFile,
        JSON.stringify(assignments, null, 2)
    );

    res.json({
        message: "Assignment deleted successfully"
    });
});

// Edit assignment
app.put("/api/assignments/:id", (req, res) => {

    const id = Number(req.params.id);

    const assignment = assignments.find(a => a.id === id);

    if (!assignment) {
        return res.status(404).json({
            message: "Assignment not found"
        });
    }

    assignment.title = req.body.title;
    assignment.description = req.body.description;
    assignment.dueDate = req.body.dueDate;
    assignment.priority = req.body.priority;

    fs.writeFileSync(
        dataFile,
        JSON.stringify(assignments, null, 2)
    );

    res.json({
        message: "Assignment updated successfully"
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});