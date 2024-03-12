const { json } = require("body-parser");
const { error } = require("console");
const express = require("express");
const app = express();
const port = 3000;

const fs = require("fs");

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    fs.readFile("./data/todos.json", (err, data) => {
        if (err) {
            console.error("Error reading todos:", err);
            res.render("home", { todos: [] });
            return;
        }
        const todos = JSON.parse(data);
        res.render("home", { todos: todos });
    });
});

app.post("/add", (req, res) => {
    const formData = req.body;
    if (formData.todo.trim() == "") {
        fs.readFile("./data/todos.json", (err, data) => {
            if (err) throw err;
            const todos = JSON.parse(data);
            res.render("home", { error: true, todos: todos });
        });
    } else {
        fs.readFile("./data/todos.json", (err, data) => {
            if (err) throw err;

            const todos = JSON.parse(data);

            const todo = {
                id: id(),
                description: formData.todo,
                done: false,
            };

            todos.push(todo);

            fs.writeFile("./data/todos.json", JSON.stringify(todos), (err) => {
                if (err) throw err;

                res.redirect("/");
            });
        });
    }
});

app.listen(port, () => {
    console.log(`The application is running on port ${port}`);
});

function id() {
    return "_" + Math.random().toString(36).substr(2, 9);
}
