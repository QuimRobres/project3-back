const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User.model");
const Worker = require("../models/Worker.model");
const transporter = require("../configs/nodemailer.config");
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const { checkRole } = require("../middlewares/index");

var message = {
  from: "sender@server.com",
  to: "receiver@sender.com",
  subject: "Message title",
  text: "Plaintext version of the message",
  html: "<p>HTML version of the message</p>",
};
//Create user -------- OK
router.post("/createUser", (req, res, next) => {
  const {
    client_number,
    name,
    surname,
    birthday,
    phone_number,
    email,
    password,
  } = req.body;
  console.log(req.body);
  if (password.length < 3) {
    return res.status(400).json({
      message: "Please make your password at least 3 characters long",
    });
  }

  if (
    !client_number ||
    !name ||
    !surname ||
    !birthday ||
    !phone_number ||
    !email ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields in the form" });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ message: "User already exists. Please change your email" });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        client_number,
        name,
        surname,
        birthday,
        phone_number,
        email,
        password: hashPass,
      })
        .then((newUser) => {
          transporter
            .sendMail({
              from: "ironhacknails@gmail.com",
              to: email,
              subject: "Bienvenido a Iron Nails!",
              html: `<p>Gracias por tu registro ${name}</p>`,
            })
            .then(() => {
              console.log("CREADO");
              return res.status(200).json(newUser);
            })
            .catch((err) =>
              res.status(500).json({ err: "error linea 91", message: err })
            );
        })
        .catch((error) =>
          res.status(500).json({ error: "error linea 96", message: error })
        );
    })
    .catch((error) =>
      res.status(500).json({ error: "error linea 83", message: error })
    );
});

//Create worker ------ OK
router.post("/createWorker", (req, res, next) => {
  const { name, surname, email, password, phone_number, role } = req.body;

  if (password.length < 3) {
    return res.status(400).json({
      message: "Please make your password at least 3 characters long",
    });
  }

  if (!name || !surname || !email || !password || !phone_number || !role) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields in the form" });
  }

  Worker.findOne({ email }).then((worker) => {
    if (worker) {
      return res
        .status(400)
        .json({ message: "Worker already exists. Please change the email" });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    Worker.create({
      name,
      surname,
      email,
      password: hashPass,
      phone_number,
      role,
    })
      .then((newWorker) => res.status(200).json(newWorker))
      .catch((err) => res.status(500).json(err));
  });
});

//LOGIN ----------- OK
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, theUser, failureDetails) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!theUser) {
      return res.status(401).json(failureDetails);
    }

    req.login(theUser, (error) => {
      console.log("Auth routes", theUser);
      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json(theUser);
    });
  })(req, res, next);
});

//LOGOUT ------- OK
router.post("/logout", (req, res, next) => {
  req.logout();
  return res.status(200).json({ message: "Log out success!" });
});

router.get("/loggedin", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  } else {
    return res.status(403).json({ message: "Forbbiden" });
  }
});

module.exports = router;
