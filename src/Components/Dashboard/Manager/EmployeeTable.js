import { Button } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ManagerDashboard from "./ManagerDashboard";

const drawerWidth = 100;

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
    // ...theme.mixins.toolbar,
  },
  hover: {
    cursor: "pointer",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    marginTop: "60px",
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: "400px",
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

export default function EmployeeTable() {
  const classes = useStyles();
  // let history = useHistory();
  const [employeeData, setEmployeeData] = React.useState([{}]);

  // function to get employee data
  const getData = async () => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.get(
        "http://localhost:8000/auth/allemployee",
        config
      );
      // set res data
      setEmployeeData(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // funtion to delete employee
  const deleteEmployee = async (employeeId) => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // delete api call
      const res = await axios.delete(
        "http://localhost:8000/auth/delete/" + employeeId,
        config
      );
      console.log(res);
      if (res.data) {
        handleClickSnackbar("Employee deleted successfully");
      }
      // get data function to call after deleting
      // to fetch list of updated employees
      getData();
    } catch (error) {
      console.log(error.message);
    }
  };

  // useEffect
  useEffect(() => {
    // getdata function on page load
    getData();
  }, []);

  // Modal for add and edit
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [isAddMode, setIsAddMode] = React.useState(true);
  const [oneEmployeeData, setOneEmployeeData] = React.useState(null);

  // state to store Employee Object
  const [state, setState] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    role: 0,
  });

  // destructuring
  const { name, email, number, password } = state;

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Add employee function
  const onSubmitAddEmployee = async (e) => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // api call to add data
      const res = await axios.post(
        "http://localhost:8000/auth/addemployee",
        state,
        config
      );

      if (res.data) {
        handleClickSnackbar("Employee added successfully");
      }

      // empty state object
      setState({
        name: "",
        email: "",
        number: "",
        password: "",
        role: 0,
      });
      // close modal
      handleClose();
      // get updated data
      getData();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function toggle edit mode
  const editEmployeeModal = (employeeData) => {
    // set edit mode to false
    setIsAddMode(false);
    setOneEmployeeData(employeeData);
    setState({
      name: employeeData.name,
      email: employeeData.email,
      number: employeeData.number,
      password: employeeData.password,
      role: 0,
    });
  };

  // Function toggle add mode
  const changeIsAddMode = () => {
    setIsAddMode(true);
    setState({
      name: "",
      email: "",
      number: "",
      password: "",
      role: 0,
    });
  };

  // Edit employee function
  const onSubmitEditEmployee = async (e) => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // api call to edit data
      const res = await axios.put(
        "http://localhost:8000/auth/edit/" + oneEmployeeData._id,
        state,
        config
      );

      if (res.data) {
        handleClickSnackbar("Employee edited successfully");
      }

      // empty state object
      setState({
        name: "",
        email: "",
        number: "",
        password: "",
        role: 0,
      });
      // close modal
      handleClose();
      // get updated data
      getData();
    } catch (error) {
      console.log(error.message);
    }
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
      <h2 id="simple-modal-title">
        {isAddMode === true ? "Add Employee" : "Edit Employee"}
      </h2>
      <p id="simple-modal-description">
        <form style={{ textAlign: "center" }}>
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={handleChange}
            type="text"
            variant="outlined"
            fullWidth
          />
          <br />
          <br />
          <TextField
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
            type="email"
            variant="outlined"
            fullWidth
          />
          <br />
          <br />
          <TextField
            label="Phone Number "
            name="number"
            value={number}
            onChange={handleChange}
            type="number"
            variant="outlined"
            fullWidth
          />
          <br />
          <br />
          <TextField
            label="Password"
            name="password"
            value={password}
            onChange={handleChange}
            type="password"
            variant="outlined"
            fullWidth
          />
          <br />
          <br />
          {isAddMode === true ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem" }}
              onClick={onSubmitAddEmployee}
              fullWidth
            >
              Save
            </Button>
          ) : (
            <Button
              type="button"
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem" }}
              onClick={onSubmitEditEmployee}
              fullWidth
            >
              Edit
            </Button>
          )}
        </form>
      </p>
    </div>
  );

  return (
    <div>
      <ManagerDashboard>
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
        <div>
          <div className={classes.toolbar}>
            <h1>Employee Data</h1>
            <Button
              color="primary"
              align="center"
              style={{ lineHeight: "0px" }}
              onClick={() => {
                handleOpen();
                changeIsAddMode();
              }}
            >
              <PersonAddIcon />
            </Button>
          </div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Phone Number</TableCell>
                  <TableCell colSpan={2} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.number}</TableCell>
                    <TableCell
                      align="right"
                      onClick={() => {
                        handleOpen();
                        editEmployeeModal(row);
                      }}
                      className={classes.hover}
                    >
                      <EditIcon />
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => deleteEmployee(row._id)}
                      className={classes.hover}
                    >
                      <DeleteIcon />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </ManagerDashboard>
    </div>
  );
}
