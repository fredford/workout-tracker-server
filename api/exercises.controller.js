import ExercisesDAO from "../dao/exercisesDAO.js";

export default class ExercisesController {
  static async apiGetExercises(req, res, next) {
    const exercisesPerPage = req.query.exercisesPerPage
      ? parseInt(req.query.exercisesPerPage, 10)
      : 20;

    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};

    if (req.query.user) {
      filters.user = req.query.user;
    }

    if (req.query.name) {
      filters.name = req.query.name;
    }

    const { exercisesList, totalNumExercises } =
      await ExercisesDAO.getExercises({ filters, page, exercisesPerPage });

    let response = {
      exercises: exercisesList,
      page: page,
      filters: filters,
      entries_per_page: exercisesPerPage,
      total_results: totalNumExercises,
    };
    res.json(response);
  }

  static async apiPostExercise(req, res, next) {
    try {
      const exercise = {
        id: req.body.exercise_id,
        name: req.body.name,
        area: req.body.area,
        muscles: req.body.muscles,
        type: req.body.type,
        goalPerSet: req.body.goalPerSet,
        goalPerWorkout: req.body.goalPerWorkout,
        user: req.body.user,
      };
      const ExerciseResponse = await ExercisesDAO.addExercise(exercise);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateExercise(req, res, next) {
    try {
      const exercise = {
        id: req.body._id,
        name: req.body.name,
        area: req.body.area,
        muscles: req.body.muscles,
        type: req.body.type,
        goalPerSet: req.body.goalPerSet,
        goalPerWorkout: req.body.goalPerWorkout,
        user: req.body.user,
      };
      const ExerciseResponse = await ExercisesDAO.updateExercise(exercise);

      var { error } = ExerciseResponse;

      if (error) {
        res.status(400).json({ error });
      }

      if (ExerciseResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update exercise - user did not create exercise"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteExercise(req, res, next) {
    try {
      const exerciseId = req.query.id;
      const userId = req.query.user;

      const ExerciseResponse = await ExercisesDAO.deleteExercise(
        exerciseId,
        userId
      );

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.messsage });
    }
  }
}
