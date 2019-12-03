const express = require("express");
const db = require("../data/db");

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  res.status(200).send({ message: "Works!" });
});

module.exports = router;
