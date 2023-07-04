const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Daydetails = require("../models/daydetails");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

// This is middleware function to check if token is present
const { isSignedIn, newTask } = require("./middleware");

// addemployee route for adding a employee
router.post("/addemployee", async (req, res) => {
  const { name, email, password, number, role } = req.body;

  try {
    let user = new User({
      name,
      email,
      password,
      number,
      role,
    });

    user = await user.save();
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// route for getting one employee
router.get("/employee/:id", isSignedIn, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

// get all employees
router.get("/allemployee", isSignedIn, async (req, res) => {
  try {
    let user = await User.find();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

// edit employee route
router.put("/edit/:id", isSignedIn, async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Get Error");
  }
});

// delete employee route
router.delete("/delete/:id", isSignedIn, async (req, res) => {
  console.log(req.body);
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Get Error");
  }
});

// Route for user login (Admin / Employee)
router.post("/login", async (req, res) => {
  try {
    // Get user data with email and password
    let user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    // If user is null
    if (user == null) {
      return res.json("Invalid credentials");
    }

    // Create token
    const token = jwt.sign({ _id: user._id }, "shhhh");

    // Set token in browser
    res.cookie("token", token, { expire: new Date() + 9999 });

    // extract string from date
    const date = new Date().toISOString().slice(0, 10);

    // Get task details for employee using id and date
    let getDayDetailsOld = await Daydetails.findOne({
      date: date,
      employee: user._id,
    });

    if (getDayDetailsOld == null) {
      await newTask();
    }

    let getDayDetails = await Daydetails.findOne({
      date: date,
      employee: user._id,
    });

    // If login time is not NA it means user has already logged in earlier
    // and previous login time was set
    // therefore return
    if (getDayDetails.login_time !== "NA") {
      res.json({ user, token: token });
      return;
    }

    // If not then this is the first time user is logging in
    getDayDetails.login_time = new Date().toLocaleTimeString("it-IT");

    // Update day details
    let getNewDayDetails = await Daydetails.findOneAndUpdate(
      {
        date: date,
        employee: user._id,
      },
      { $set: getDayDetails },
      { new: true }
    );

    // return json
    res.json({ user: user, Task: getNewDayDetails, token: token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

router.post("/logout/:id", async (req, res) => {
  try {
    // Get user data with email and password
    let user = await User.findById(req.params.id);

    // If user is null
    if (user == null) {
      return res.json("User not found");
    }

    // Get task details for employee using id and date
    const date = new Date().toISOString().slice(0, 10);

    // get day details for that particular day
    let getDayDetails = await Daydetails.findOne({
      date: date,
      employee: req.params.id,
    });

    // if (getDayDetails.logout_time !== "NA") {
    //   res.json(user);
    //   return;
    // }

    // edit the logout time to current logout time
    getDayDetails.logout_time = new Date().toLocaleTimeString("it-IT");

    // update request
    let getNewDayDetails = await Daydetails.findOneAndUpdate(
      {
        date: date,
        employee: req.params.id,
      },
      { $set: getDayDetails },
      { new: true }
    );

    // clear cookie from user browser
    res.clearCookie("token");

    // return json
    res.json({ user: user, Task: getNewDayDetails });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
