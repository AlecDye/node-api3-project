const express = require("express");

const Users = require("./userDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const postInfo = req.body;
  if (postInfo.name) {
    Users.insert(postInfo);
    res.status(201).json({ message: "User successfully created!" });
  } else {
    res.status(400).json({ errorMessage: "Please provide name for user." });
  }
});

router.post("/:id/posts", validateUser, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };
  Users.insert(postInfo)
    .then((post) => {
      res.status(200).json({ message: "Added successfully", post });
    })
    .catch((err) => res.status(500).json({ message: "We broke", err }));
});

router.get("/", validateUser, (req, res) => {
  Users.get()
    .then((users) => {
      if (users) {
        res.status(200).json({ message: "Users sent!", users });
      } else {
        res.status(404).json({ message: "Users not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Whoops our bad, server broke", error });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  Users.getById(id)
    .then((user) => {
      res.status(200).json({ message: "User sent!", user });
    })
    .catch((error) => {
      res.status(500).json({ message: "Whoops our bad, server broke", error });
    });
});

router.get("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  const id = req.params.id;
  Users.getUserPosts(id)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((error) => {
      res.status(500).json({ message: "Something broke on our end", error });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "You blew it up! Nice." });
      } else {
        res
          .status(404)
          .json({ message: "Nothing here. Did you delete it already?" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error occured while destorying user",
        error,
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "This user isn't here" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error occured with server", error });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  Users.getById(id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found!" });
      }
      next();
    })
    .catch((error) => {
      res.status(500).json({ message: "Server broke", error });
    });
}

function validateUser(req, res, next) {
  const userData = req.body;
  if (Object.keys(userData).length === 0) {
    res.status(500).json({ message: "Error empty userData object" });
  } else if (!userData.name) {
    res.status(400).json({ message: "Name is required" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const postData = req.body;
  if (Object.keys(postData).length === 0) {
    res.status(500).json({ message: "Error empty postData object" });
  } else if (!postData.text) {
    res.status(400).json({ message: "Text is required" });
  } else {
    next();
  }
}

module.exports = router;
