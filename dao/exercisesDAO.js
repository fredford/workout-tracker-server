let exercises;

export default class ExercisesDAO {
  static async injectDB(conn) {
    if (exercises) {
      return;
    }

    try {
      exercises = await conn
        .db(process.env.WORKOUTTRACKER_NS)
        .collection("exercises");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in exercisesDAO: ${e}`
      );
    }
  }

  static async getExercises({
    filters = null,
    page = 0,
    exercisesPerPage = 10,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      }
    }

    console.log(query);

    let cursor;

    try {
      cursor = await exercises.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { exercisesList: [], totalNumExercises: 0 };
    }

    const displayCursor = cursor
      .limit(exercisesPerPage)
      .skip(exercisesPerPage * page);

    try {
      const exercisesList = await displayCursor.toArray();
      const totalNumExercises = await exercises.countDocuments(query);
      return { exercisesList, totalNumExercises };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { exercisesList: [], totalNumExercises: 0 };
    }
  }
}
