// Public routes
import auth from "./userAuth";

// Private routes
import user from "./user";
import exercises from "./exercises";
import workouts from "./workouts";
import workout from "./workout";
import set from "./sets";
import stats from "./stats";

const publicRoutes = [auth];

const privateRoutes = [user, exercises, workouts, workout, set, stats];

const routes = [...publicRoutes, ...privateRoutes];

export default routes;
