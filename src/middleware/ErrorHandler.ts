// Library imports
import mongoose from "mongoose";
// Utilities
import { ErrorResponse } from "../utils/errorResponse";
// Mongoose Models
import { UserDocument } from "../models/User";

/**
 * Class for checking user inputs, database results and user access
 * requests. Handles the majority of common operations across the
 * application.
 */
class ErrorHandler {
  /**
   * Method to check if variables are valid
   * @param variables object to be checked for missing data
   */
  checkVariables(variables: object, type: string): void {
    Object.entries(variables).forEach(([key, value]) => {
      if (!value) {
        switch (type) {
          case "PleaseProvide":
            throw new ErrorResponse(errorTypes.PleaseProvide(key), 400);
          case "NotFound":
            throw new ErrorResponse(errorTypes.NotFound(key), 404);
          case "Invalid":
            throw new ErrorResponse(errorTypes.Invalid(key), 401);
        }
      }
    });
  }

  /**
   * Method to check if an ID is a valid ObjectId for mongoose
   * @param queryId array containing the query ID and the query name
   * @returns a valid ObjectId as a string
   */
  checkQueryId(queryId: string[]): string {
    if (!mongoose.Types.ObjectId.isValid(queryId[1])) {
      throw new ErrorResponse(errorTypes.QueryIdNotValid(queryId[0]), 400);
    }
    return queryId[1];
  }

  /**
   * Verify that the results of the query are valid
   * @param document - mongoose document object
   * @param queryId - ObjectId used to query the database
   */
  checkValidQuery(document: any, queryId: string): void {
    if (document._id.toString() !== queryId)
      throw new ErrorResponse(errorTypes.QueryNotValid(), 500);
  }

  /**
   * Check if the requesting User has access to this document
   * @param document -mongoose document object
   * @param user - UserDocument of the requester to be compared against
   */
  checkDocumentAccess(document: any, user: UserDocument): void {
    if (
      document.user._id.toString() !== user._id.toString() &&
      document.user._id.toString() !== (process.env.ADMIN_ID as string)
    ) {
      throw new ErrorResponse(errorTypes.DocumentAccess(document.name), 403);
    }
  }
}

/**
 * Helper function to capitalize the first letter of a string
 * @param input - input string to be capitalized
 * @returns - string with a capitalized first letter
 */
const upperCaseFirst = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

/**
 * Object containing functions that will provide tailored error messages
 */
const errorTypes = {
  PleaseProvide: (key: string) =>
    `Please provide ${key.match("^[aieouAIEOU].*") ? "an" : "a"} ${key}`,
  NotFound: (key: string) => `${upperCaseFirst(key)} not found`,
  Invalid: (key: string) => `${upperCaseFirst(key)} is invalid`,
  QueryIdNotValid: (key: string) => `${upperCaseFirst(key)} is invalid`,
  DocumentAccess: (key: string) => `${upperCaseFirst(key)} is not accessible`,
  QueryNotValid: () => "Query returned incorrect results",
};

const errorHandler = new ErrorHandler();

export default errorHandler;
