const express = require("express");
const router = express.Router();
const Daydetails = require("../models/daydetails");
const User = require("../models/user");
const cron = require("node-cron");
const { isSignedIn, newTask } = require("./middleware");

// running a schedule using cron job
// sec, min, hour, day of month, month, day of week
// sec = 0,  min = 0
cron.schedule("0 0 * * *", newTask);

router.post("/add", async (req, res) => {
  const { date, employee, task, task_description, login_time, logout_time } =
    req.body;

  try {
    let getDayDetails = await Daydetails.find({
      date: date,
      employee: employee,
    });
    console.log(getDayDetails.length);

    if (getDayDetails.length != 0) {
      throw new Error("Task for the day is already added!");
    }

    let daydetails = new Daydetails({
      date,
      employee,
      task,
      task_description,
      login_time,
      logout_time,
    });

    daydetails = await daydetails.save();
    res.json(daydetails);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/gettask/:task_id", isSignedIn, async (req, res) => {
  try {
    let taskDetails = await Daydetails.findById(req.params.task_id).populate({
      path: "employee",
      model: User,
    });

    res.json(taskDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

router.put("/task_update/:task_id", isSignedIn, async (req, res) => {
  try {
    let taskDetails = await Daydetails.findByIdAndUpdate(
      req.params.task_id,
      { $set: { status: true } },
      { new: true }
    ).populate({
      path: "employee",
      model: User,
    });

    res.json(taskDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

router.put("/task_update_desc/:task_id", isSignedIn, async (req, res) => {
  try {
    let taskDetails = await Daydetails.findByIdAndUpdate(
      req.params.task_id,
      { $set: req.body },
      { new: true }
    ).populate({
      path: "employee",
      model: User,
    });

    res.json(taskDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

router.get("/getemployeetask/:employee_id", isSignedIn, async (req, res) => {
  // const { date } = req.body;
  try {
    let taskDetails = await Daydetails.find({
      // date: date,
      employee: req.params.employee_id,
    }).populate({ path: "employee", model: User });

    res.json(taskDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

router.put("/get/:employee_id", isSignedIn, async (req, res) => {
  const { date } = req.body;
  try {
    let result = await Daydetails.findOneAndUpdate(
      {
        date: date,
        employee: req.params.employee_id,
      },
      { $set: req.body },
      { new: true }
    );

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

// Get task deatils for specified date range
router.post("/range/:employeeId", isSignedIn, async (req, res) => {
  const { start_date, end_date } = req.body;

  try {
    let allTasks = await Daydetails.find({
      date: { $gte: start_date, $lte: end_date },
      employee: req.params.employeeId,
    });

    res.json(allTasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

// Get all counts
router.get("/getallcount", async (req, res) => {
  try {
    // Employee count
    let employeeArray = await User.find();
    let employeeArrayCount = employeeArray.length;

    // Total task count
    let taskCountArray = await Daydetails.find();
    let totalTaskCount = taskCountArray.length;

    let completedTaskCount = 0;
    let notCompletedTaskCount = 0;

    // Total completed count
    taskCountArray.map((oneTask) => {
      if (oneTask.status) completedTaskCount++;
    });

    // Total incomplete count
    taskCountArray.map((oneTask) => {
      if (!oneTask.status) notCompletedTaskCount++;
    });

    res.json({
      EmployeeCount: employeeArrayCount,
      TotalTask: totalTaskCount,
      CompletedTask: completedTaskCount,
      IncompleteTask: notCompletedTaskCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

// Get one employee count
router.get("/getcount/:id", async (req, res) => {
  try {
    // Employee count
    let employeeDetailsObject = await User.findById(req.params.id);

    // Update day details
    let taskObject = await Daydetails.findOne(
      {
        date:  new Date().toISOString().slice(0, 10),
        employee: employeeDetailsObject._id,
      }
    );

    // Total task count
    let taskCountArray = await Daydetails.find({ employee: req.params.id });
    let totalTaskCount = taskCountArray.length;

    let completedTaskCount = 0;
    let notCompletedTaskCount = 0;

    // Total completed count
    taskCountArray.map((oneTask) => {
      if (oneTask.status) completedTaskCount++;
    });

    // Total incomplete count
    taskCountArray.map((oneTask) => {
      if (!oneTask.status) notCompletedTaskCount++;
    });

    res.json({
      EmployeeLoginTime: taskObject.login_time,
      TotalTask: totalTaskCount,
      CompletedTask: completedTaskCount,
      IncompleteTask: notCompletedTaskCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Get Error");
  }
});

module.exports = router;
