// Public routes
import auth from "./userAuth";

// Private routes
import user from "./user";
import exercises from "./exercises";
import workouts from "./workouts";
import set from "./sets";
import stats from "./stats";
import weight from "./weight";
import steps from "./steps";
// Set list of public routes
const publicRoutes = [auth];

// Set list of private routes
const privateRoutes = [user, exercises, workouts, set, stats, weight, steps];

// Combine lists into export routes
const routes = [...publicRoutes, ...privateRoutes];

export default routes;
