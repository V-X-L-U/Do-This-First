const express = require("express");

const { createData, getDataById } = require("../controllers/mongooseTestController");

const router = express.Router();

router.post("/", [createData]);
router.get("/:id", [getDataById]);

module.exports = router;