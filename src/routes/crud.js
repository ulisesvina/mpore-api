const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  { handle500 } = require("../lib/handle"),
  prisma = new PrismaClient(),
  router = Router();

router.post("/changeBio", async (req, res) => {
  const { bio } = req.body;
  let token = req.headers.authorization;

  if (!bio)
    return res.status(400).json({ message: "Bio is required", status: 400 });
  if (!token)
    return res.status(401).json({ message: "Unauthorized", status: 401 });

  token = token.split(/\s+/)[1];

  try {
    await prisma.user.update({
      where: { id: res.locals.user.id },
      data: { bio },
    });
    res.status(200).json({ message: "Bio updated", status: 200 });
  } catch (error) {
    handle500(error, res);
  }
});

router.post("/createPost", async (req, res) => {
  try {
    const { title, content } = req.body;
    await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: res.locals.user.id },
        }
      },
    });
    res.status(201).json({ message: "Post created", status: 201 });
  } catch (error) {
    handle500(error, res);
  }
});

module.exports = router;
