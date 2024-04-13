const express = require("express");
const router = express.Router();
const Post = require("../model/Post");

//routes

//GET--HOME
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "Blog | Mrityunjay",
      description: "Created with NodeJS,Express and MongoDB.",
    };

    let perPage = 2;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

//GET- request for the post:id

router.get("/post/:id", async (req, res) => {
  try {
    const slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "A simple blog post made using NodeJs",
    };

    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

//POST-request for searchTerm

router.post("/search-results", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "A simple blog post made using NodeJs",
    };

    let searchTerm = req.body.SearchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search-results", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

//GET-request for the about page

router.get("/about", (req, res) => {
  try {
    const locals = {
      title: "About me",
      description: "A simple blog post made using NodeJs",
    };

    res.render("about", { locals });
  } catch (error) {
    console.log(error);
  }
});

//GET-request for the contact page

router.get("/contact", (req, res) => {
  try {
    const locals = {
      title: "Contact me",
      description: "A simple blog post made using NodeJs",
    };

    res.render("contact", { locals });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

//--Basic version
// router.get("", async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "A simple blog post made using NodeJs",
//   };
//   try {
//     const data = await Post.find();
//     res.render("index", { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });
