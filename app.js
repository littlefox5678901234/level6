const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.json());
const path = require("path");

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const overdueTodos = await Todo.getOverdueTodos();
  const dueTodayTodos = await Todo.getDueTodayTodos();
  const dueLaterTodos = await Todo.getDueLaterTodos();
  const todosCount = await Todo.getTodosCount();

  if (request.accepts("html")) {
    response.render("index", {
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      todosCount,
    });
  } else {
    response.json({
      allTodos,
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

/* Sequelize-cli(Without UI) endpoints/route using express.js: */
// app.get("/", function (request, response) {
//   response.send("Hello World");
// });

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todosList = await Todo.findAll();
    return response.send(todosList);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    if (todo === null) return response.send(false);
    else {
      const deletedTodosCount = await todo.destroy({
        where: { id: request.params.id },
      });
      return response.json(true);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
