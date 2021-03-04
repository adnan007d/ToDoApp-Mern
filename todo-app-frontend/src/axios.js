import axios from "axios";

const instance = axios.create({
  baseURL: "https://todo-mern-backend.herokuapp.com",
});

export default instance;
