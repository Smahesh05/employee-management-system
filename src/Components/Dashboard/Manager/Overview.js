import React from "react";
import ManagerDashboard from "./ManagerDashboard";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { PieChart } from "react-minimal-pie-chart";
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
}));

export default function Overview() {
  const classes = useStyles();
  
  const [countData, setCountData] = React.useState({});

   // function to get employee data
   const getData = async () => {
    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.get(
        "http://localhost:8000/task/getallcount",
        config
      );
      // set res data
      setCountData(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(countData);

  React.useEffect(() => {
    getData();
  }, [])
  
  return (
    <div>
      <ManagerDashboard>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            {/* <Paper className={classes.paper}> */}
            <Typography style={{textAlign:'center'}}> Task Completion Chart</Typography>
            <PieChart
              data={[
                { title: "Completed Task", value: countData.CompletedTask, color: "#E38627" },
                { title: "Incompleted Task", value: countData.IncompleteTask, color: "#6A2135" },
              ]}
            />
            {/* </Paper> */}
          </Grid>
          <Grid container item xs={12} md={7} spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Typography>Total Employees -</Typography>
                <Typography className={classes.font}>{countData.EmployeeCount}</Typography>
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
                <Typography>Total Completed Tasks - </Typography>
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
      </ManagerDashboard>
    </div>
  );
}
