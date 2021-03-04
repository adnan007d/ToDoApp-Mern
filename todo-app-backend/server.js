// imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import mongoData from "./mongoData.js";
import Pusher from "pusher";

// App config
const app = express();
const port = process.env.PORT || 9000;

// Fix For Routing Issue

const pusher = new Pusher({
  appId: "",
  key: "",
  secret: "",
  cluster: "",
  useTLS: true,
});

// Middlewares
app.use(express.json());
app.use(cors());

// DB config
const mongoURI = "";
mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB Connected");

  const changeStream = mongoose.connection.collection("todos").watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusher.trigger("todos", "newTodo", change.fullDocument);
      console.log("Added");
    } else if (change.operationType === "delete") {
      pusher.trigger("todos", "deleteTodo", {});
      console.log("Deleted");
    } else if (change.operationType === "update") {
      pusher.trigger("todos", "updateTodo", {});
      console.log("Updated");
    } else {
      console.log("Error triggering pusher");
    }
  });
});

// API routes
app.get("/", (req, res) => res.status(200).send("Hello World!!"));

// Add new ToDo
app.post("/new/todo", async (req, res) => {
  const dbData = req.body;
  await mongoData.create(dbData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// Get all ToDo
app.get("/get/todo", async (req, res) => {
  await mongoData
    .find()
    .sort({
      timestamp: 1,
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Delete a specific ToDo
app.get("/delete/todo", async (req, res) => {
  const id = req.query.id;
  await mongoData.deleteOne(
    {
      _id: id,
    },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    }
  );
});

// Update a ToDo
app.post("/update/todo", async (req, res) => {
  const dbData = req.body;

  await mongoData.updateOne(
    {
      _id: dbData.id,
    },
    { $set: dbData },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    }
  );
});

// Linstening
app.listen(port, () => console.log(`Listening on localhost:${port}`));
