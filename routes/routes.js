// Public routes
import auth from "./userAuth.js";

// Private routes
import user from "./user.js";
import exercises from "./exercises.js";
import workouts from "./workouts.js";
import workout from "./workout.js";
import set from "./sets.js";
import stats from "./stats.js";

const publicRoutes = [
    auth
];

const privateRoutes = [
    user,
    exercises,
    workouts, 
    workout, 
    set,
    stats
];

const routes = [...publicRoutes, ...privateRoutes];

export default routes;
