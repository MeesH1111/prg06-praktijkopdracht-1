import express from 'express';
import mongoose from "mongoose";
import decksRouter from "./routes/decksRouter.js";

const app = express();

await mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    const acceptHeader = req.headers['accept'];
    // console.log(`Client accepteert: ${acceptHeader}`);

    if (acceptHeader.includes('application/json') || req.method === 'OPTIONS') {
        next()
    } else {
        res.status(406).send('Illegal format');
    }

});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content
    }

    next();
});

// Cache-Control toevoegen

// CORS moet in app.use, net zoals de acceptHeader. Staat in slide 24 van LES 6
// Checker stuurt lege documenten
app.use('/', decksRouter);
app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port: ${process.env.EXPRESS_PORT}`);
});