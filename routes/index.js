const express = require("express");
const router = express.Router();
const studentroute = require("./students")
const teachersroute = require("./teachers")


router.use("/student",studentroute)
router.use("/teacher",teachersroute)


module.exports = router;