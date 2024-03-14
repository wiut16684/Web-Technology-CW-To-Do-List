const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Seting up middlewares
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Home route
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

// Adding task route
app.post("/add", (req, res) => {
    const formData = req.body;
    if (formData.todo.trim() == "") {
        // If the todo is empty, render home with an error
        fs.readFile("./data/todos.json", (err, data) => {
            if (err) {
                console.error("Error reading todos:", err);
                res.render("home", { error: true, todos: [] });
                return;
            }
            const todos = JSON.parse(data);
            res.render("home", { error: true, todos: todos });
        });
    } else {
        // If the todo is not empty, add it to the list and redirect to home
        fs.readFile("./data/todos.json", (err, data) => {
            if (err) {
                console.error("Error reading todos:", err);
                res.status(500).send("Internal Server Error");
                return;
            }

            const todos = JSON.parse(data);

            const todo = {
                id: id(),
                description: formData.todo,
                done: false,
            };

            todos.push(todo);

            fs.writeFile("./data/todos.json", JSON.stringify(todos), (err) => {
                if (err) {
                    console.error("Error writing todos:", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                res.redirect("/");
            });
        });
    }
});

// Deleting task route
app.get("/:id/delete", (req, res) => {
    const id = req.params.id;
    fs.readFile("./data/todos.json", (err, data) => {
        if (err) {
            console.error("Error reading todos:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const todos = JSON.parse(data);
        const filteredTodos = todos.filter((todo) => todo.id != id);
        fs.writeFile(
            "./data/todos.json",
            JSON.stringify(filteredTodos),
            (err) => {
                if (err) {
                    console.error("Error writing todos:", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                res.redirect("/");
            }
        );
    });
});

// Updating task route
app.get("/:id/update", (req, res) => {
    const id = req.params.id;
    fs.readFile("./data/todos.json", (err, data) => {
        if (err) {
            console.error("Error reading todos:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        const todos = JSON.parse(data);
        const todo = todos.find((todo) => todo.id === id);

        if (!todo) {
            res.status(404).send("Todo not found");
            return;
        }

        todo.done = true;

        fs.writeFile("./data/todos.json", JSON.stringify(todos), (err) => {
            if (err) {
                console.error("Error writing todos:", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            res.redirect("/");
        });
    });
});

// Starting the server
app.listen(port, () => {
    console.log(`The application is running on port ${port}`);
});

// Random ID generator function
function id() {
    return "_" + Math.random().toString(36).substr(2, 9);
}
