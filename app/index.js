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
const idrnRoutes = require("./routes/idrn.route");
const templateRoutes = require("./routes/template.route");
const recordRoutes = require("./routes/record.route");
const organizationRoutes = require("./routes/organization.route");
const taskRoutes = require("./routes/task.route");
const teamRoutes = require("./routes/team.route");

// API Routes Declare
app.use("/server", serverRoutes);
app.use("/user", validateServerToken, userRoutes);
app.use("/simpleStorage", validateServerToken, simpleStorageRoutes);
app.use("/volunteerProfile", validateServerToken, volunteerProfileRoutes);
app.use("/idrn", validateServerToken, idrnRoutes);
app.use("/template", validateServerToken, templateRoutes);
app.use("/record", validateServerToken, recordRoutes);
app.use("/organization", validateServerToken, organizationRoutes);
app.use("/task", validateServerToken, taskRoutes);
app.use("/team", validateServerToken, teamRoutes);

// Test Routes
app.get("/test/get", (req, res) => { res.json({ data: "get-route" }); });
app.post("/test/post", (req, res) => { res.json({ data: req.body, message: "post-route" }); });

module.exports = app;