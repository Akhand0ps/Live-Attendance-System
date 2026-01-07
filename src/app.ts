import express from "express";

const app = express();

import UserR from "./routes/user.route.js"
import ClassR from "./routes/class.route.js"

app.use(express.json());


app.use("/api/v1/auth",UserR)
app.use("/api/v1/",ClassR);


export default app;