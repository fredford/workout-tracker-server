import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import Exercise from "../models/Exercise";
import Workout from "../models/Workout";
import { UserDocument } from "../models/User";
import errorHandler from "./ErrorHandler";

import { ErrorResponse } from "../utils/errorResponse";

export const getAllDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const postDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Obtain the object for the given Model type
  const modelObj = Models[req.url];

  try {
    // Get the User Document from the Protected Request
    const user: UserDocument = req.user;
    // Perform the Document create with Mongoose
    const result = await modelObj.model.create(
      Models[req.url].createObj(req.body, user)
    );
    // Respond with the created Document
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (!error.statusCode) console.log(`POST new - ${modelObj.type} ${error}`);
    next(error);
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the request URL from the path
  const reqUrl = req.url.split("?")[0];
  // Obtain the object for the given Model type
  const modelObj = Models[reqUrl];

  try {
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
      result.deleteOne();
    } else {
      throw new ErrorResponse(`User cannot delete ${modelObj.type}`, 403);
    }

    // Respond with success and a success message
    res.status(200).json({ success: true, data: "Success" });
  } catch (error: any) {
    if (!error.statusCode)
      console.log(`Delete one - ${modelObj.type} ${error}`);
    next(error);
  }
};

interface IModels {
  [key: string]: any;
}

interface IExercise {
  name: string;
  area: string;
  type: string;
  user: Types.ObjectId;
  isAdmin: boolean;
}

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
    model: Set,
    type: "Set(s)",
  },
};
