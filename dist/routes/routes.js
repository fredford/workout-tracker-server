"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Public routes
const userAuth_1 = __importDefault(require("./userAuth"));
// Private routes
const user_1 = __importDefault(require("./user"));
const exercises_1 = __importDefault(require("./exercises"));
const workouts_1 = __importDefault(require("./workouts"));
const workout_1 = __importDefault(require("./workout"));
const sets_1 = __importDefault(require("./sets"));
const stats_1 = __importDefault(require("./stats"));
const publicRoutes = [userAuth_1.default];
const privateRoutes = [user_1.default, exercises_1.default, workouts_1.default, workout_1.default, sets_1.default, stats_1.default];
const routes = [...publicRoutes, ...privateRoutes];
exports.default = routes;
