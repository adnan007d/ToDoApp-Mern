import React, { useEffect, useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
} from "@material-ui/core";
import axios from "./axios";
import { Delete } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import "./ToDoList.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
const useStyles = makeStyles((theme) => ({
  model: {
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100vh",
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function ToDoList({ todo, id, timestamp }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(todo);
  const [dateTime, setDateTime] = useState(timestamp);
  const [dateValid, setDateValid] = useState(new Date(timestamp) > new Date());

  useEffect(() => {
    setInput(todo);
    setDateTime(timestamp);
    setDateValid(new Date(timestamp) > new Date());
  }, [todo, timestamp]);

  const handleDelete = () => {
    const response = window.confirm(
      "Are you sure you want to delete the ToDo ?"
    );
    if (response) {
      axios.get("/delete/todo?id=" + id);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    setDateValid(date > new Date());
    setDateTime(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/update/todo", {
      id: id,
      work: input,
      timestamp: dateTime,
    });
    setInput("");
    setOpen(false);
  };
  return (
    <div className="toDoList">
      <Modal
        open={open}
        onClose={handleClose}
        className={classes.model}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <form className="updateForm">
            <h1 className="updateForm_title">Update ToDo</h1>
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
                value={dateTime}
                inputVariant="outlined"
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
                Update
              </Button>
            </MuiPickersUtilsProvider>
          </form>
        </div>
      </Modal>
      <List>
        <ListItem
          className={`toDoList_item ${
            new Date() > new Date(timestamp) ? "expired" : ""
          }`}
        >
          <ListItemText
            primary={todo}
            secondary={`Deadline ${new Date(
              timestamp
            ).toDateString()} ${new Date(timestamp).toLocaleTimeString()}`}
          ></ListItemText>
          <ListItemIcon>
            <IconButton onClick={handleOpen}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </List>
    </div>
  );
}

export default ToDoList;
