const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  { handle500 } = require("../lib/handle"),
  prisma = new PrismaClient(),
  router = Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (existingUsers.length > 0)
      return res
        .status(400)
        .json({ message: "Username or email already exists", status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        email,
        bio: "Hello, I'm a new Mpore user!",
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created", status: 201 });
  } catch (error) {
    handle500(error, res);
  }
});

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
    handle500(error, res);
  }
});

module.exports = router;
