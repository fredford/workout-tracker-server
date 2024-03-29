// Library imports
import { Request, Response, NextFunction } from "express";
// Mongoose Models
import Exercise from "../models/Exercise";
import Workout from "../models/Workout";
import SetModel from "../models/Set";
import Weight from "../models/Weight";
import Steps from "../models/Steps";
import { UserDocument } from "../models/User";
// Utilities
import errorHandler from "./ErrorHandler";
import { ErrorResponse } from "../utils/errorResponse";
import { model } from "mongoose";

/**
 * Request controller for finding and returning all
 * documents for an endpoint
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const getAllDocuments = async (req: Request, res: Response, next: NextFunction) => {
  // Obtain the object for the given Model type
  const modelObj = Models[req.url];

  try {
    // Get the User Document from the Protected Request
    const user: UserDocument = req.user;
    // Get the User ID's to query for
    const query = [user, process.env.ADMIN_ID];
    // Perform the query and return a list of Documents
    const results = await modelObj.model
      .find({
        user: { $in: query },
      })
      .sort({ name: 1 });
    // Respond with the results from the query
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    if (!error.statusCode) console.log(`GET all -  ${modelObj.type} ${error}`);
    next(error);
  }
};

/**
 * Request controller for finding and returning a specific Document
 * from a given ObjectID
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  // Get the request URL from the path
  const reqUrl = req.url.split("?")[0];
  // Obtain the object for the given Model type
  const modelObj = Models[reqUrl];

  try {
    // Get the User Document from the Protected Request
    const user: UserDocument = req.user;
    // Check that the exercise ID is a valid ObjectId
    const queryId = errorHandler.checkQueryId(["ID", req.query.id as string]);
    // Query database for exercise ID provided
    const result = await modelObj.model.findById(queryId).populate("user");
    // Check if a Document is returned
    errorHandler.checkVariables({ result }, "NotFound");
    // Check that the Document is correct
    errorHandler.checkValidQuery(result, queryId);
    // Check that the Document is accessible to the User
    errorHandler.checkDocumentAccess(result, user);
    // Respond with the Document found
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Get By ID - ${modelObj.type} ${error}`);
    next(error);
  }
};

/**
 * Request controller for adding a new Document to the database for
 * a given endpoint
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const postDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtain the object for the given Model type
    const modelObj = Models[req.url];

    if (modelObj === undefined) {
      throw new ErrorResponse("Not found", 404);
    }
    // Get the User Document from the Protected Request
    const user: UserDocument = req.user;
    // Perform the Document create with Mongoose
    const result = await modelObj.model.create(Models[req.url].createObj(req.body, user));
    // Respond with the created Document
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (!error.statusCode) console.log(`POST new - ${error}`);
    next(error);
  }
};

/**
 * Request controller for deleting a Document from the database for
 * a given endpoint
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the request URL from the path
    const reqUrl = req.url.split("?")[0];
    // Obtain the object for the given Model type
    const modelObj = Models[reqUrl];
    if (modelObj === undefined) {
      throw new ErrorResponse("Not found", 404);
    }
    // Get User Document from Protected Request
    const user: UserDocument = req.user;
    // Check that the exercise ID is a valid ObjectId
    const queryId = errorHandler.checkQueryId(["ID", req.query.id as string]);

    // Query for the Exercise Document of the queryId provided
    const result = await modelObj.model.findById(queryId).populate("user");

    // Check if a Document is returned
    errorHandler.checkVariables({ result }, "NotFound");
    // Check that the correct Exercise Document is found
    errorHandler.checkValidQuery(result, queryId);

    // Check if the User associated to the Exercise is the same as the requesting User
    if (result.user._id.toString() === user._id.toString()) {
      await result.removeOne();
    } else {
      throw new ErrorResponse(`User cannot delete ${modelObj.type}`, 403);
    }

    // Respond with success and a success message
    res.status(200).json({ success: true, data: "Success" });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Delete one - ${error}`);
    next(error);
  }
};

// Interface for an object with strings for keys.
interface IModels {
  [key: string]: any;
}

/**
 * Object that represents each endpoint
 * @model - Model object for the endpoint
 * @type - Document type for the endpoint
 * @createObj - Method for data to be used in creating a new Document
 */
const Models: IModels = {
  "/exercises": {
    model: Exercise,
    type: "Exercise(s)",
    createObj: (reqBody: JSON, user: UserDocument) => {
      return { user, ...reqBody, isAdmin: user._id === process.env.ADMIN_ID };
    },
  },
  "/exercise": {
    model: Exercise,
    type: "Exercise(s)",
    createObj: (reqBody: JSON, user: UserDocument) => {
      return { user, ...reqBody, isAdmin: user._id === process.env.ADMIN_ID };
    },
  },
  "/workouts": {
    model: Workout,
    type: "Workout(s)",
    createObj: (reqBody: JSON, user: UserDocument) => {
      return { user, ...reqBody };
    },
  },
  "/workout": {
    model: Workout,
    type: "Workout(s)",
    createObj: (reqBody: JSON, user: UserDocument) => {
      return { user, ...reqBody };
    },
  },
  "/sets": {
    model: SetModel,
    type: "Set(s)",
  },
  "/weight": {
    model: Weight,
    type: "Weight",
    createObj: (reqBody: JSON, user: UserDocument) => {
      return { user, ...reqBody };
    },
  },
  "/steps": {
    model: Steps,
    type: "Steps",
    createObj: (reqBody: JSON, user: UserDocument) => {
      return { user, ...reqBody };
    },
  },
};
