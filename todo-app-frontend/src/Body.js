import React, { useEffect, useState } from "react";
import "./Body.css";
import { Button, TextField } from "@material-ui/core";
import axios from "./axios";
import ToDoList from "./ToDoList";
import Pusher from "pusher-js";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

function Body() {
  const [toDo, setToDo] = useState([]);
  const [input, setInput] = useState("");
  const [dateTime, setDateTime] = useState(new Date().toISOString());
  const [dateValid, setDateValid] = useState(false);
  const getConnection = () => {
    axios.get("/get/todo").then((response) => setToDo(response.data));
  };

  useEffect(() => {
    getConnection();
  }, []);

  useEffect(() => {
    const pusher = new Pusher("92ab600f6d7ee54b0feb", {
      cluster: "mt1",
    });

    const channel = pusher.subscribe("todos");
    channel.bind("newTodo", function (data) {
      getConnection();
    });
    channel.bind("deleteTodo", (data) => {
      getConnection();
    });
    channel.bind("updateTodo", (data) => getConnection());
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [toDo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/new/todo", {
      work: input,
      timestamp: dateTime,
    });
    setInput("");
  };

  const handleDateChange = (date) => {
    setDateValid(date > new Date());
    setDateTime(date);
  };

  return (
    <div className="body">
      <div className="body_input">
        <form>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TextField
              variant="outlined"
              label="Task"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />

            <KeyboardDatePicker
              disableToolbar
              variant="dialog"
              format="MM/dd/yyyy"
              margin="normal"
              label="Deadline Date"
              value={dateTime}
              inputVariant="outlined"
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Deadline Time"
              inputVariant="outlined"
              value={dateTime}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
            <Button
              variant="outlined"
              type="submit"
              onClick={handleSubmit}
              style={{
                height: "100%",
              }}
              disabled={!input || !dateValid}
            >
              Add
            </Button>
          </MuiPickersUtilsProvider>
        </form>
      </div>
      <div className="body_list">
        {toDo.map((todo) => {
          return (
            <ToDoList
              key={todo._id}
              todo={todo.work}
              id={todo._id}
              timestamp={todo.timestamp}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Body;
