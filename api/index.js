const serverless = require("serverless-http");
const app = require("../server.js"); // your Express app exported from server.js

module.exports = serverless(app);
