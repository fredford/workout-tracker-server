import { ObjectId } from "mongodb";

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
      if ("user" in filters) {
        query = Object.assign(
          {},
          {
            $or: [
              { user: { $eq: ObjectId(filters["user"]) } },
              { user: { $eq: "admin" } },
            ],
          }
        );
        if ("name" in filters) {
          query = Object.assign(query, { $text: { $search: filters["name"] } });
        }
      }
    }

    let cursor;

    try {
      cursor = await exercises.find(query).sort({ name: 1 });
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

  static async addExercise(exercise) {
    try {
      const exerciseDoc = {
        name: exercise.name,
        area: exercise.area,
        muscles: exercise.muscles,
        type: exercise.type,
        goalPerSet: exercise.goalPerSet,
        goalPerWorkout: exercise.goalPerWorkout,
        user: ObjectId(exercise.user),
      };

      return await exercises.insertOne(exerciseDoc);
    } catch (e) {
      console.error(`Unable to post exercise: ${e}`);
    }
  }

  static async updateExercise(exercise) {
    try {
      const updateResponse = await exercises.updateOne(
        { user: exercise.user, _id: ObjectId(exercise.id) },
        {
          $set: {
            name: exercise.name,
            area: exercise.area,
            muscles: exercise.muscles,
            type: exercise.type,
            goalPerSet: exercise.goalPerSet,
            goalPerWorkout: exercise.goalPerWorkout,
          },
        }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update exercise: ${e}`);
      return { error: e };
    }
  }

  static async deleteExercise(exerciseId, userId) {
    try {
      const deleteResponse = await exercises.deleteOne({
        _id: ObjectId(exerciseId),
        user: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete exercise: ${e}`);
      return { error: e };
    }
  }
}
