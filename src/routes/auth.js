const { Router } = require("express"),
  { PrismaClient } = require("@prisma/client"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken"),
  errorHandler = require("../lib/errorHandle"),
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
      return errorHandler.badRequest(
        { message: "Username or email already exists" },
        res
      );

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
    errorHandler.internalServerError(error, res);
  }
});

router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email)
    return errorHandler.badRequest(
      { message: "Username or email is required" },
      res
    );

  try {
    const user = await prisma.user.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (user.length === 0) {
      return errorHandler.badRequest(
        { message: "Username or email is invalid" },
        res
      );
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return errorHandler.badRequest({ message: "Password is invalid" }, res);
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
    errorHandler.internalServerError(error, res);
  }
});

module.exports = router;
