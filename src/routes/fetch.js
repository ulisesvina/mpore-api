const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  errorHandler = require("../lib/errorHandle"),
  prisma = new PrismaClient(),
  router = Router();

router.get("/postsByUser", async (req, res) => {
  try {
    let { username, id } = req.query;
    if (!username && !id)
      return res
        .status(400)
        .json({ message: "Username or id is required", status: 400 });

    if (!id) {
      const user = await prisma.user.findFirst({
        where: { username },
      });
      id = user.id;
    }
    const posts = await prisma.post.findMany({
      where: { author: { id } },
    });
    res.status(200).json({ posts, status: 200 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

router.get("/postById", async (req, res) => {
  try {
    let { id } = req.query;
    if (!id)
      return errorHandler.badRequest({ message: "ID is required" }, res);
    const post = await prisma.post.findFirst({
      where: { id },
    });
    res.status(200).json({ post, status: 200 });
  } catch (error) {
    errorHandler.internalServerError(error, res);
  }
});

router.get("/getFollowers", async (req, res) => {
    try {
        let { username, id } = req.query;
        if (!username || !id)
            return errorHandler.badRequest({ message: "Username or ID is required" }, res);
        if(!id) {
            const user = await prisma.user.findFirst({
                where: { username },
            });

            id = user.id;
        }
        const followers = await prisma.user.findMany({
            where: { following: { some: { id: id } } },
        });
        res.status(200).json({ followers, status: 200 });
    }
    catch (error) {
        errorHandler.internalServerError(error, res);
    }
});

module.exports = router;
