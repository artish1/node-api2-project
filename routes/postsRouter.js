const express = require("express");
const db = require("../data/db");

const router = express.Router();
router.use(express.json());

//Get ALL posts.
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.log("Error on GET / in postsRouter", err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

//Create a Post.
router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(req.body)
      .then(idObj => {
        res.status(201).json(idObj);
      })
      .catch(err => {
        console.log("Error on POST / in postsRouter", err);
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  }
});

module.exports = router;
