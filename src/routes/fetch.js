const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  { handle500 } = require("../lib/handle"),
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
    handle500(error, res);
  }
});

module.exports = router;
