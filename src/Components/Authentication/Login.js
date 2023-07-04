import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// Copyright code
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://t3.ftcdn.net/jpg/01/22/71/96/360_F_122719641_V0yw2cAOrfxsON3HeWi2Sf4iVxhv27QO.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  let history = useHistory();

  // state for storing login data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClickSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  // state for errors
  // const [error, setError] = useState(null);

  // destructing state object
  const { email, passowrd } = loginData;

  // function to set text value to respective property
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Function for login
  const onSubmit = async (e) => {
    e.preventDefault();

    // header configuration
    const config = {
      "Content-Type": "application/json",
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/auth/login",
        loginData,
        config
      );

      if (res) {
        // code for fetcing location
        if (navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(async (data) => {
            // Get current location based on latitude and longitude
            const locationData = await axios.get(
              "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
                data.coords.latitude +
                "&longitude=" +
                data.coords.longitude +
                "&localityLanguage=en",
              config
            );

            // set the location property of the response object to the current city
            res.data.user.location =
              locationData.data.localityInfo.administrative[2].name;

            // update the user document
            const result = await axios.put(
              "http://localhost:8000/auth/edit/" + res.data.user._id,
              res.data.user,
              config
            );
            console.log(result);
          });
        } else {
          alert("The Browser Does not Support Geolocation");
        }
      }

      // based on the user role redirect the user to admin or employee dashboard
      if (res.data.user.role === 0) {
        window.sessionStorage.setItem("key", JSON.stringify(res.data));
        history.push("/profile", { params: res.data });
      } else {
        window.sessionStorage.setItem("key", JSON.stringify(res.data));
        history.push("/overview", { params: res.data });
      }
    } catch (error) {
      console.log(error.message);
      handleClickSnackbar();
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
          Please check your credentials
        </Alert>
      </Snackbar>
    </Grid>
  );
}
