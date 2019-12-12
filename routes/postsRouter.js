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

//Get post by id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(post => {
      if (post.length > 0) {
        res.json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error on GET /:id in postsRouter", err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
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
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

//Get comments of a post from post id
router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(posts => {
      if (posts.length > 0) {
        db.findPostComments(id)
          .then(comments => {
            res.json(comments);
          })
          .catch(err => {
            console.log(
              "Error on GET /:id/comments when trying to get comments",
              err
            );
            res.status(500).json({
              message:
                "There was an error retrieving the comments from the post"
            });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error on GET /:id/comments when finding post by id", err);
      res
        .status(500)
        .json({ error: "There was an error trying to find post by id" });
    });
});

//Create a comment
router.post("/:id/comments", (req, res) => {
  if (!req.body.text)
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });

  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post.length > 0) {
        db.insertComment({ post_id: id, text: req.body.text })
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(err => {
            console.log(
              "Error on POST /:id/comments in postsRouter while inserting comment",
              err
            );
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database"
            });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error on POST /:id/comments in postsRouter", err);
      res.status(500).json({
        error: "There was an error while finding the post id to the database"
      });
    });
});

//Delete post by ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(posts => {
      if (posts.length > 0) {
        db.remove(id)
          .then(recordsDeleted => {
            res.json({ recordsDeleted });
          })
          .catch(err => {
            console.log(
              "Error on DELETE /:id when trying to delete the post",
              err
            );
            res.status(500).json({ error: "The post could not be removed" });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error on DELETE /:id when finding post by id", err);
      res.status(500).json({ error: "There was an error finding post by id" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  if (!req.body.title || !req.body.contents)
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });

  db.findById(id)
    .then(posts => {
      if (posts.length > 0) {
        db.update(id, req.body)
          .then(updatedRecords => {
            res.status(200).json({ updatedRecords });
          })
          .catch(err => {
            console.log("Error on PUT /:id when updating post", err);
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(
        "Error on PUT /:id in postsRouter when finding post by id",
        err
      );
      res
        .status(500)
        .json({ error: "There was an error finding the post by id" });
    });
});

module.exports = router;
