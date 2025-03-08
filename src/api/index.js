const express = require("express");

const router = express.Router();

router.use("/main", require("./main/index.js"));

module.exports = router;
