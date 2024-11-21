const express = require("express");
const router = express.Router();
const studentroute = require("./students")
const teachersroute = require("./teachers")
const classesroutes = require("./classes")
const adminroute = require("./admin")


router.use("/admin",adminroute)
router.use("/student",studentroute)
router.use("/teacher",teachersroute)
router.use("/class",classesroutes)


module.exports = router;