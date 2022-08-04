const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Middleware Imports
const { validateServerToken } = require("./middlewares/server.middleware");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => { res.send("SIH Node Server"); });

// API Routes Import
const serverRoutes = require("./routes/server.route");
const userRoutes = require("./routes/user.route");
const simpleStorageRoutes = require("./routes/simple-storage.route");
const volunteerProfileRoutes = require("./routes/volunteer-profile.route");

// API Routes Declare
app.use("/server", serverRoutes);
app.use("/user", validateServerToken, userRoutes);
app.use("/simpleStorage", validateServerToken, simpleStorageRoutes);
app.use("/volunteerProfile", validateServerToken, volunteerProfileRoutes);

// Test Routes
app.get('/test/get', (req, res) => { res.json({ data: 'get-route' }) });
app.post('/test/post', (req, res) => { res.json({ data: req.body, message: 'post-route' }) });

module.exports = app;