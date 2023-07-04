var expressJwt = require('express-jwt');
const Daydetails = require("../models/daydetails");
const User = require("../models/user");

exports.isSignedIn = expressJwt({
    secret: "shhhh",
    userProperty: "auth"
})

exports.newTask = async () => {
    console.log("In new task");
    var employeeDataArray = [];
  
    try {
      employeeDataArray = await User.find();
  
      employeeDataArray.forEach(async (employee) => {
        let getDayDetails = await Daydetails.find({
          date: new Date().toISOString().slice(0, 10),
          employee: employee._id,
        });
  
        console.log(getDayDetails.length);
        console.log(new Date());
  
        if (getDayDetails.length != 0) {
          return;
        }
  
        let daydetails = new Daydetails({
          date: new Date().toISOString().slice(0, 10),
          employee: employee._id,
          task: "NA",
          task_description: "NA",
          login_time: "NA",
          logout_time: "NA",
          status: false,
        });
  
        daydetails = await daydetails.save();
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Get Error");
    }
  }