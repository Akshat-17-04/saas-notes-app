const serverless = require("serverless-http");
const app = require("../server"); // your Express app exported from server.js

module.exports = serverless(app);
