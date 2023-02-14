const { Router } = require("express");
const router = Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { userProfile } = require("../db");

const verifyToken = async (req, res, next) => {
  try {
    const headerToken = req.get("Authorization");
    if (!headerToken) return res.status(401).json({ error: "token invalid" });

    const token = headerToken.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const verifyUser = await userProfile.findOne({
        where: { email: decoded.user_email },
      });
      if (!verifyUser)
        return res.status(403).json({ error: "User unauthorize" });

      req.email = decoded.user_email;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "there's an error", message: error });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ error: "there's an error", message: error.message });
  }
};

router.get("/getusers", async (req, res) => {
  const users = await userProfile.findAll();
  return res.json(users);
});

router.delete("/deleteuser", async (req, res) => {
  const { user_id } = req.query;
  await userProfile.destroy({ where: { id: user_id } });
  return res.json({ message: "User deleted" });
});

router.put("/updateuser", async (req, res) => {
  const { user_id } = req.query;
  await userProfile.update(req.body, { where: { id: user_id } });
  res.json({ message: "user updated" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;
    if (!name || !lastName || !email || !password)
      return res.status(400).json({ error: "missing required information" });

    const user = await userProfile.findOne({ where: { email: email } });
    if (user)
      return res.status(404).json({ error: "User email already exist" });

    const passwordHashed = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_NUMBER)
    );

    const newUser = await userProfile.create({
      name,
      lastName,
      email,
      password: passwordHashed,
    });

    const token = jwt.sign(
      { user_email: newUser.email },
      process.env.SECRET_KEY
    );
    const userRegistare = await userProfile.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });

    return newUser
      ? res.status(200).json({ token: token, user: userRegistare })
      : res.status(404).json({ error: "there's been an error" });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "there's an error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(404).json({ error: "email and password are required" });

    const user = await userProfile.findOne({ where: { email: email } });
    if (!user)
      return res.status(404).json({ error: "User-email or password invalid" });

    const passwordCompared = await bcrypt.compare(password, user.password);
    if (!passwordCompared)
      return res.status(404).json({ error: "User-email or password invalid" });

    const token = jwt.sign({ user_email: user.email }, process.env.SECRET_KEY);
    const verifyUser = await userProfile.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json({ token: token, user: verifyUser });
  } catch (error) {
    return res
      .status(401)
      .json({ error: "there's an error", message: error.message });
  }
});

router.get("/verifyUser", [verifyToken], async (req, res) => {
  try {
    const user = await userProfile.findOne({
      where: { email: req.email },
      attributes: { exclude: ["password"] },
    });
    user
      ? res.status(200).json(user)
      : res.status(404).json({ error: "the user is not registrated" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "there's an error", message: error.message });
  }
});

// module.exports = router;
module.exports = {
  routerRegistration: router,
  verifyToken,
};
