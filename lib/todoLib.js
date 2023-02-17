const { default: mongoose } = require("mongoose");
const todoModel = require("../models/todo.model");

module.exports.getAllTodos = async function (filter, callBack) {
    try {
        var todos = await todoModel.find(filter);
        callBack(null, todos); 
    } catch (err) {
        callBack(err, null);
    }
};

module.exports.getTodoById = async function (id, callBack) {
    try {
        var todo = await todoModel.findById(new mongoose.Types.ObjectId(id));
        callBack(null, todo);
    } catch (err) {
        callBack(err, null);
    }
};

module.exports.createTodo = async function (todo, callBack) {
    try {
        var newTodo = new todoModel(todo);
        var result = await newTodo.save();
        callBack(null, result);
    } catch (err) {
        callBack(err, null);
    }
};

module.exports.updateTodo = async function (id, todo, callBack) {
    try {
        var query = {
            _id: new mongoose.Types.ObjectId(id),
        };
        console.log(todo);
        var updatedTodo = await todoModel.updateOne(query, todo, { new: true });
        console.log(updatedTodo);
        callBack(null, updatedTodo);
    } catch (err) {
        callBack(err, null);
    }
};

module.exports.deleteTodo = async function (id, callBack) {
    try {
        var query = {
            _id: new mongoose.Types.ObjectId(id),
        };
        var updatedTodo = await todoModel.updateOne(
            query,
            { isDeleted: true },
            { new: true }
        );
        callBack(null, updatedTodo);
    } catch (err) {
        callBack(err, null);
    }
};
