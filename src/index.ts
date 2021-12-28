import express from "express";
import config from "./config";

const app = express();

const { port } = config;

app.get("/", (req, res) => {
    res.json({ message: "Server Online" });
});

app.listen(port);
console.log(`[${process.env.NODE_ENV}] Running on localhost:${port}`);

export default app;
