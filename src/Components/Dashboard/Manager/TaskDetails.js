import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Link } from "@material-ui/core";
// import { useHistory } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import { Button, Typography } from "@material-ui/core";
import ManagerDashboard from "./ManagerDashboard";
import Modal from "@material-ui/core/Modal";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
// Excel Imports
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
  },
  leftMargin: {
    padding: theme.spacing(0, 1),
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
    width: 200,
  },
  textField2: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  paperTheme: {
    padding: theme.spacing(2),
    height: theme.spacing(30),
    // flexGrow: 10
    // textAlign: "center",
    // color: theme.palette.text.primary,
  },
  excelButton: {
    color: "#fff",
    backgroundColor: "#5cb85c",
    borderColor: "#4cae4c",
    padding: "6px 12px",
    borderRadius: "4px",
    border: "1px solid transparent",
    marginTop: "15px",
    cursor: "pointer",
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function TaskDetails() {
  const classes = useStyles();
  const location = useLocation();

  // Getting employee data
  var oneEmployeeData = location.state.params;

  // state variables
  const [state, setState] = React.useState({
    sortAsc: true,
  });

  // state for task details array
  const [taskDetailsArray, setTaskDetailsArray] = React.useState([{}]);

  // For searching task is specified date range
  const [rangeDetails, setRangeDetails] = useState({
    start_date: "",
    end_date: "",
  });

  // desctructuring
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
      // api call to get array based on range
      const res = await axios.post(
        "http://localhost:8000/task/range/" + oneEmployeeData._id,
        rangeDetails,
        config
      );
      // update state array for tasks
      setTaskDetailsArray(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to get all tasks of the employee
  const getAllTaskDetails = async () => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // api call to get all tasks of employee
      const res = await axios.get(
        "http://localhost:8000/task/getemployeetask/" + oneEmployeeData._id,
        config
      );
      // sort array in descending order to range
      res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTaskDetailsArray(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // getAllTaskDetails function on page load
    getAllTaskDetails();
  }, []);

  // FUnction to sort array based on date
  const sortArray = () => {
    state.sortAsc = !state.sortAsc;
    var sorted = [];
    state.sortAsc
      ? (sorted = [...taskDetailsArray].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ))
      : (sorted = [...taskDetailsArray].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ));
    setTaskDetailsArray(sorted);
  };

  // Modal
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [isAddMode, setIsAddMode] = React.useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [newTask, setNewTask] = useState({
    date: "",
    employee: "",
    login_time: "NA",
    logout_time: "NA",
    status: false,
    task: "",
    task_description: "",
  });

  const {
    date,
    // employee,
    // login_time,
    // logout_time,
    // status,
    task,
    task_description,
  } = newTask;

  const handleChangeTask = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  // Function to toggle edit modal
  const editEmployeeModal = (taskData) => {
    setIsAddMode(false);
    setNewTask(taskData);
  };

  // Add task function
  const onSubmitAdd = async (e) => {
    // set employee id to task object
    newTask.employee = oneEmployeeData._id;

    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // post api call to add task
      const res = await axios.post(
        "http://localhost:8000/task/add",
        newTask,
        config
      );
      if (res.data) {
        handleClickSnackbar("Task added successfully");
      }
      // close modal
      handleClose();
      // get updated task data array
      getAllTaskDetails();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Edit task function
  const onSubmitEdit = async (e) => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // put api call to edit
      const res = await axios.put(
        "http://localhost:8000/task//task_update_desc/" + newTask._id,
        newTask,
        config
      );
      if (res.data) {
        handleClickSnackbar("Task edited successfully");
      }
      // close modal
      handleClose();
      // get updated task data array
      getAllTaskDetails();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to toggle add modal
  const changeIsAddMode = () => {
    setIsAddMode(true);
    setNewTask({
      date: "",
      employee: "",
      login_time: "NA",
      logout_time: "NA",
      status: false,
      task: "",
      task_description: "",
    });
  };

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(null);

  const handleClickSnackbar = (successMessage) => {
    setSuccessMessage(successMessage);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  // Modal body
  const body = (
    <div>
      <h2 id="simple-modal-title"> {isAddMode ? "Add Task" : "Edit Task"}</h2>
      <div id="simple-modal-description">
        <div style={{ textAlign: "center" }}>
          {isAddMode ? (
            <TextField
              id="date"
              label="Task Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              name="date"
              value={date}
              onChange={handleChangeTask}
              inputProps={{ min: "2022-04-01", max: "2022-12-31" }}
              variant="outlined"
              fullWidth
            />
          ) : (
            ""
          )}
          <br />
          <br />
          <TextField
            label="Task Name"
            name="task"
            value={task}
            onChange={handleChangeTask}
            type="string"
            variant="outlined"
            fullWidth
          />
          <br />
          <br />
          <TextField
            label="Task Description"
            name="task_description"
            value={task_description}
            onChange={handleChangeTask}
            type="string"
            rows={4}
            multiline
            variant="outlined"
            fullWidth
          />
          <br />
          <br />
          {isAddMode ? (
            <Button
              type="Submit"
              variant="contained"
              color="primary"
              onClick={onSubmitAdd}
              fullWidth
            >
              Add
            </Button>
          ) : (
            <Button
              type="Submit"
              variant="contained"
              color="primary"
              onClick={() => {
                onSubmitEdit();
              }}
              fullWidth
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="background">
      <ManagerDashboard>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.paperTheme}>
              <div className={classes.toolbar}>
                <h1>Task Details</h1>&nbsp;&nbsp;
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleOpen();
                    changeIsAddMode();
                  }}
                >
                  add new
                </Button>
              </div>
              <div className={classes.leftMargin}>
                <h3>Name : {oneEmployeeData.name}</h3>
                <h3>Email : {oneEmployeeData.email}</h3>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paperTheme}>
              <div style={{ textAlign: "center" }}>
                <Typography>Select Dates To Filter Task List</Typography>

                <br />
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

                <br />
                <br />
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={getRangeTask}
                  width="contained"
                  className={classes.textField2}
                >
                  Search
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>

        {/* Actual Content */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            {body}
          </div>
        </Modal>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
          >
            {successMessage}
          </Alert>
        </Snackbar>
        <div style={{ display: "flex", verticalAlign: "middle" }}>
          <h2>Task List</h2>&nbsp;&nbsp;&nbsp;
          <div>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className={classes.excelButton}
              table="table-to-xls"
              filename="TaskDetails"
              sheet="tablexls"
              buttonText="Download Excel"
            />
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            aria-label="simple table"
            id="table-to-xls"
          >
            <TableHead>
              <TableRow>
                <TableCell align="left">Task Assigned</TableCell>
                <TableCell align="left">Task Description</TableCell>
                <TableCell align="left" onClick={() => sortArray()}>
                  Assignment Date
                  {!state.sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </TableCell>
                <TableCell align="left">Login Time</TableCell>
                <TableCell align="left">Logout Time</TableCell>
                <TableCell align="left">Completion Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taskDetailsArray.map((row) => (
                <TableRow
                  key={row._id}
                  onClick={() => {
                    editEmployeeModal(row);
                    handleOpen();
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Link>{row.task}</Link>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.task_description}
                  </TableCell>
                  <TableCell align="left">
                    {row.date ? row.date.slice(0, 10) : ""}
                  </TableCell>
                  <TableCell align="left">{row.login_time}</TableCell>
                  <TableCell align="left">{row.logout_time}</TableCell>
                  <TableCell align="left">
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
      </ManagerDashboard>
    </div>
  );
}
