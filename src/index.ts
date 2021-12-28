import express from "express";
import config from "./config";
import initializeGraphQL from "./graphql";

const { port } = config;
const context = { config };

const app = express();

initializeGraphQL(app, context).then(() => {
    app.get("/", (req, res) => {
        res.json({ message: "Server Online" });
    });
    
    app.listen(port);
    console.log(`[${process.env.NODE_ENV}] Running on localhost:${port}`);
});


export default app;
