const express = require("express");
const router = express.Router();
const studentroute = require("./students")
const teachersroute = require("./teachers")
const classesroutes = require("./classes")


router.use("/student",studentroute)
router.use("/teacher",teachersroute)
router.use("/class",classesroutes)


module.exports = router;