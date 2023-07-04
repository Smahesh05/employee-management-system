import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { useHistory } from "react-router-dom";
import axios from "axios";

import Grid from "@material-ui/core/Grid";

import TextField from "@material-ui/core/TextField";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import { Button, DialogTitle } from "@material-ui/core";
import EmployeeDashboard from "./EmployeeDashboard";

// Dialog box
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    // justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  hover: {
    cursor: "pointer",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
}));

export default function EmployeeTasks() {
  const classes = useStyles();
  let history = useHistory();

  // state variables
  const [sortAsc, setSortAsc] = React.useState(true);
  const [taskDetailsArray, setTaskDetailsArray] = React.useState([{}]);

  // fetching session storage user and token object
  var data = window.sessionStorage.getItem("key");
  data = JSON.parse(data);

  // For searching task is specified date range
  const [rangeDetails, setRangeDetails] = useState({
    start_date: "",
    end_date: "",
  });

  //destructuring
  const { start_date, end_date } = rangeDetails;

  const handleChange = (e) => {
    setRangeDetails({
      ...rangeDetails,
      [e.target.name]: e.target.value,
    });
  };

  // function to sort list based on range
  const getRangeTask = async () => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/task/range/" + data.user._id,
        rangeDetails,
        config
      );
      // update state array for tasks
      setTaskDetailsArray(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // get all tasks for employee
  const getTaskDetails = async () => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    // fetch data from session storage
    var data = window.sessionStorage.getItem("key");
    data = JSON.parse(data);

    try {
      // get api call to get list for task for the employee
      const res = await axios.get(
        "http://localhost:8000/task/getemployeetask/" + data.user._id,
        config
      );
      // sort array is descending order
      res.data.sort((a, b) => new Date(b.date) - new Date(a.date));

      // set the sorted array to state variable
      setTaskDetailsArray(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // get list of tasks on page load
    getTaskDetails();
  }, []);

  // Function to sort array based on date
  const sortArray = () => {
    setSortAsc(!sortAsc);
    var sorted;
    sortAsc
      ? (sorted = [...taskDetailsArray].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ))
      : (sorted = [...taskDetailsArray].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ));
    setTaskDetailsArray(sorted);
  };

  // mark task completed
  const markTaskComplete = async () => {
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // put call to update task
      const res = await axios.put(
        "http://localhost:8000/task/task_update/" + taskToMarkComplete._id,
        config
      );

      // get updated task list
      getTaskDetails();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Dialog box
  const [open, setOpen] = React.useState(false);
  const [taskToMarkComplete, setTaskToMarkComplete] = React.useState({});

  const handleClickOpen = (taskData) => {
    setTaskToMarkComplete(taskData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <EmployeeDashboard>
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.textField}>
              <h3>Select Dates To Filter Task List</h3>
            </div>
            <div>
              <form className={classes.container} noValidate>
                <TextField
                  id="start_date"
                  label="Start Date"
                  type="date"
                  defaultValue={Date.now()}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="start_date"
                  value={start_date}
                  onChange={handleChange}
                  inputProps={{ max: "2022-12-31" }}
                />
                <br />
                <TextField
                  id="end_date"
                  label="End Date"
                  type="date"
                  defaultValue={Date.now()}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="end_date"
                  value={end_date}
                  onChange={handleChange}
                  inputProps={{ min: start_date, max: "2022-12-31" }}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={getRangeTask}
                >
                  Search
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>

        <br />
        <div className={classes.textField}>
          <h3>Task List</h3>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Task Name</TableCell>
                <TableCell align="left">Task Description</TableCell>
                <TableCell align="left" onClick={() => sortArray()}>
                  Date of Assignment
                  {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </TableCell>
                <TableCell align="left">Login Time</TableCell>
                <TableCell align="left">
                  Completion Status ( Click <br /> to mark complete)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskDetailsArray.map((row) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row.task}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.task_description}
                  </TableCell>
                  <TableCell align="left">
                    {row.date ? row.date.slice(0, 10) : ""}
                  </TableCell>
                  <TableCell align="left">{row.login_time}</TableCell>
                  <TableCell
                    align="center"
                    onClick={() => handleClickOpen(row)}
                    style={{ cursor: "pointer" }}
                  >
                    {row.status === true ? (
                      <CheckBoxIcon style={{ color: "green" }} />
                    ) : (
                      <CancelIcon style={{ color: "red" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog content */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you have completed the task?
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                markTaskComplete();
                handleClose();
              }}
              color="primary"
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </EmployeeDashboard>
    </>
  );
}
