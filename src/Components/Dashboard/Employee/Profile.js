import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { PieChart } from "react-minimal-pie-chart";
import EmployeeDashboard from "./EmployeeDashboard";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "230px",
  },
  font: {
    fontSize: "110px",
    color: 'black'
  },
  fontTime: {
    fontSize: "70px",
    color: 'black',
    paddingTop:'25px',
    verticalAlign:'middle'
  },
}));

export default function Profile() {
  const classes = useStyles();
  
  const [countData, setCountData] = React.useState({});

  
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
        "http://localhost:8000/task/getcount/" + data.user._id,
        config
      );
      // set the sorted array to state variable
      console.log(res.data);
      setCountData(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  React.useEffect(() => {
    getTaskDetails();
  }, [])

  return (
    <div>
      <EmployeeDashboard>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography style={{textAlign:'center'}}> Task Completion Chart</Typography>
            <PieChart
              data={[
                { title: "Completed Task", value: countData.CompletedTask, color: "#E38627" },
                { title: "Incomplete task", value: countData.IncompleteTask, color: "#6A2135" },
              ]}
            />
          </Grid>
          <Grid container item xs={12} md={7} spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Typography>Login Time -</Typography>
                <Typography className={classes.fontTime}> {countData.EmployeeLoginTime ? countData.EmployeeLoginTime.slice(0, 5): ""}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Typography>Total Tasks -</Typography>
                <Typography className={classes.font}>{countData.TotalTask}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Typography>Total Completed Tasks -</Typography>
                <Typography className={classes.font}>{countData.CompletedTask}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Typography>Total Pending Tasks -</Typography>
                <Typography className={classes.font}>{countData.IncompleteTask}</Typography>
              </Paper>
            </Grid>
            {/* <Paper className={classes.paper}>xs=6</Paper> */}
          </Grid>
        </Grid>
      </EmployeeDashboard>
    </div>
  );
}
