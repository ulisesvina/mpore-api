const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  errorHandler = require("../lib/errorHandle"),
  prisma = new PrismaClient(),
  router = Router();

router.post("/changeBio", async (req, res) => {
  const { bio } = req.body;
  let token = req.headers.authorization;

  if (!bio) return errorHandler.badRequest({ message: "Bio is required" }, res);

  token = token.split(/\s+/)[1];

  try {
    await prisma.user.update({
      where: { id: res.locals.user.id },
      data: { bio },
    });
    res.status(200).json({ message: "Bio updated", status: 200 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

router.post("/createPost", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res
        .status(400)
        .json({ message: "Title and content are required", status: 400 });
    await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: res.locals.user.id },
        },
      },
    });
    res.status(201).json({ message: "Post created", status: 201 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

router.post("/deletePost", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return errorHandler.badRequest({ message: "ID is required" }, res);
    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: "Post deleted", status: 200 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

router.post("/editPost", async (req, res) => {
  try {
    const { id, title, content } = req.body;
    if (!id || !title || !content)
      return errorHandler.badRequest(
        { message: "ID, title and content are required" },
        res
      );
    await prisma.post.update({
      where: { id },
      data: { title, content, edited: true },
    });
    res.status(200).json({ message: "Post updated", status: 200 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

router.post("/follow", async (req, res) => {
  try {
    let { username, followingId } = req.body,
      id = res.locals.user.id;
    if (!username && !followingId)
      return res
        .status(400)
        .json({ message: "Username or ID required", status: 400 });
    if (!followingId) {
      const user = await prisma.user.findFirst({
        where: { username },
      });

      followingId = user.id;
    }

    await prisma.user.update({
      where: { id },
      data: {
        following: {
          connect: {
            followerId_followingId: {
              followerId: id,
              followingId,
            },
          },
        },
      },
    });

    res.status(200).json({ message: "User followed", status: 200 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

router.post("/unfollow", async (req, res) => {
  try {
    let { username, id } = req.body;
    if (!username && !id)
      return res
        .status(400)
        .json({ message: "Username or ID required", status: 400 });
    if (!id) {
      const user = await prisma.user.findFirst({
        where: { username },
      });

      id = user.id;
    }
    await prisma.user.update({
      where: { id: res.locals.user.id },
      data: { following: { disconnect: id } },
    });
    res.status(200).json({ message: "User unfollowed", status: 200 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

module.exports = router;
