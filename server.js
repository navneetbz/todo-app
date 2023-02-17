require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const todoLib = require("./lib/todoLib");

app.use(express.static("public"));
app.use(express.json());

const port = 3000;

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {}, function (err) {
    // we are tring to connect if cannot error
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to database");
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

app.get("/api/todo", async (req, res) => {

    const isDeleted = req.query?.isDeleted?.toString() ?? undefined;
    const isCompleted = req.query?.isCompleted?.toString() ?? undefined;

    let filter = {};

    if (isDeleted) {
        filter["isDeleted"] = isDeleted.toLowerCase() === "true" ? true : false
    }

    if (isCompleted) {
        filter["isCompleted"] = isCompleted?.toLowerCase() === "true" ? true : false
    }
    

    todoLib.getAllTodos(filter, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: "ERROR",
                message: err.message,
            });
        } else {
            return res.status(200).json({
                status: "SUCCESS",
                data: result,
            });
        }
    });
});

app.get("/api/todo/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    todoLib.getTodoById(todoId, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: "ERROR",
                message: err.message,
            });
        } else {
            return res.status(200).json({
                status: "SUCCESS",
                data: result,
            });
        }
    });
});

app.post("/api/todo", async (req, res) => {
    const todo = req.body;
    todoLib.createTodo(todo, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: "ERROR",
                message: err.message,
            });
        } else {
            return res.status(200).json({
                status: "SUCCESS",
                data: result,
            });
        }
    });
});

app.put("/api/todo/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    const todo = req.body;
    todoLib.updateTodo(todoId, todo, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: "ERROR",
                message: err.message,
            });
        } else {
            return res.status(200).json({
                status: "SUCCESS",
                data: result,
            });
        }
    });
});

app.delete("/api/todo/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    todoLib.deleteTodo(todoId, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: "ERROR",
                message: err.message,
            });
        } else {
            return res.status(200).json({
                status: "SUCCESS",
                data: result,
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Running on http://localhost:3000`);
});
