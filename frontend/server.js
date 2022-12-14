const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();


const catchAsync = fn => (
    (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch)
            routePromise.catch(err => next(err));
    }
);

// support for cookies

// catch errs
app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message,
            });
        default:
            return res.status(500).send({
                status: 'ERROR',
                error: err.message,
            });
    }
});

// home page, pick champion to get stats from
app.get('/', catchAsync(require("./champ_select")));

const interface = require("../backend/interface");

// get stats for a paticular champion
app.get("/champ/:id", catchAsync(require("./stat_page")));

app.get("/api/items", catchAsync((req, res) => res.send(interface.itemStats)));
app.get("/api/wrs", catchAsync((req, res) => res.send(interface.getWr())));

const port = process.env.PORT || 3005;
app.listen(port, (req, res) => {
    console.info("frontend running on port 80");
});
