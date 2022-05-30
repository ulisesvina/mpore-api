const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
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
    res.status(500).json({
      message:
        "Please open an issue in https://github.com/ulisesvina/mpore-api with the following data: " +
        error.message,
      status: 500,
    });
  }
});

router.post("/changeBio", async (req, res) => {
  const { bio } = req.body;
  let token = req.headers.authorization;

  if (!bio)
    return res.status(400).json({ message: "Bio is required", status: 400 });
  if (!token)
    return res.status(401).json({ message: "Unauthorized", status: 401 });

  token = token.split(/\s+/)[1];

  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    await prisma.user.update({
      where: { id: user.id },
      data: { bio },
    });
    res.status(200).json({ message: "Bio updated", status: 200 });
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
