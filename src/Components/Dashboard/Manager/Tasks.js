import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useRouteMatch,
//   useParams,
// } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
// import { Button } from "@material-ui/core";
// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";
// import PersonAddIcon from "@material-ui/icons/PersonAdd";
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
}));

export default function Tasks() {
  const classes = useStyles();
  let history = useHistory();
  const [employeeData, setEmployeeData] = React.useState([{}]);

  const changePage = (oneEmployeeData) => {
    history.push("/taskdetails", { params: oneEmployeeData });
  };

  // get all employee data
  const getData = async () => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      // api call to fetch all employees
      const res = await axios.get(
        "http://localhost:8000/auth/allemployee",
        config
      );
      // set employee data
      setEmployeeData(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // getdata function on page load
    getData();
  }, []);

  return (
    <div>
      <ManagerDashboard>
        <div className={classes.toolbar}>
          <h1>Employee Task List</h1>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Phone Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeData.map((row) => (
                <TableRow key={row._id} onClick={() => changePage(row)}>
                  <TableCell component="th" scope="row">
                    <Link>{row.name}</Link>
                  </TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.location}</TableCell>
                  <TableCell align="left">{row.number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ManagerDashboard>
    </div>
  );
}
