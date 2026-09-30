"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.get("/", (req, res) => {
    res.send("Hello, world!xxxx");
});
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
