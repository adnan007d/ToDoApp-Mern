import mongoose from "mongoose";

const toDoSchema = mongoose.Schema({
  work: String,
  timestamp: Date,
});

export default mongoose.model("todos", toDoSchema);
