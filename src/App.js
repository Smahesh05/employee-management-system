import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./Components/Authentication/Login";
import PrivateRoute from "./Components/Authentication/PrivateRoute";
import EmployeeDashboard from "./Components/Dashboard/Employee/EmployeeDashboard";
import EmployeeTasks from "./Components/Dashboard/Employee/EmployeeTasks";
import Profile from "./Components/Dashboard/Employee/Profile";
import EmployeeTable from "./Components/Dashboard/Manager/EmployeeTable";
import ManagerDashboard from "./Components/Dashboard/Manager/ManagerDashboard";
import Overview from "./Components/Dashboard/Manager/Overview";
import TaskDetails from "./Components/Dashboard/Manager/TaskDetails";
import Tasks from "./Components/Dashboard/Manager/Tasks";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <PrivateRoute
            exact
            path="/managerdashboard"
            component={ManagerDashboard}
          />
          <Route
            exact
            path="/employeedashboard"
            component={EmployeeDashboard}
          />
          <PrivateRoute exact path="/employees" component={EmployeeTable} />
          <PrivateRoute exact path="/overview" component={Overview} />
          <PrivateRoute exact path="/tasks" component={Tasks} />
          <PrivateRoute exact path="/taskdetails" component={TaskDetails} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/employeetasks" component={EmployeeTasks} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
