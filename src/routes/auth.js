const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  prisma = new PrismaClient(),
  router = Router();

router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email)
    return res
      .status(400)
      .json({ message: "Username or email is required", status: 400 });

  try {
    const user = await prisma.user.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (user.length === 0) {
      return res.status(400).json({ message: "User not found", status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Password is incorrect", status: 400 });
    }

    return res.status(200).json({
      message: "Login successful",
      status: 200,
      token: jwt.sign(
        {
          id: user[0].id,
          username,
          email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      ),
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Please open an issue in https://github.com/ulisesvina/mpore-api with the following data: " +
        error.message,
      status: 500,
    });
  }
});

module.exports = router;
