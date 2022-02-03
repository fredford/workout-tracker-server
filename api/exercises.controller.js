import ExercisesDAO from "../dao/exercisesDAO.js";

export default class ExercisesController {
  static async apiGetExercises(req, res, next) {
    const exercisesPerPage = req.query.exercisesPerPage
      ? parseInt(req.query.exercisesPerPage, 10)
      : 20;

    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
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
}
