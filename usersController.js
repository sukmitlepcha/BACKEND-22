import User from "../models/User.js";
import bcrypt from "bcrypt";
import transport from "../config/cloudinaryConfig.js";
import jwt from "jsonwebtoken";

async function createUser(req, res) {
  try {
    let { name, email, password } = req.body;

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    let result = await User.create({
      name,
      email,
      password: hash,
    });

    let token = jwt.sign(
      { name, email, expiresIn: 2 * 24 * 3600 },
      process.env.JWT_SECRET_KEY
    );

    const mailData = {
      from: "sukmitlepcha558@gmail.com",
      to: req.body.email,
      subject: "Account Verification",
      html: `verify with this token ${token}`,
    };
    await transport.sendMail(mailData);

    res.status(201).send({
      success: true,
      result: {
        name: result.name,
        email: result.email,
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export { createUser };
