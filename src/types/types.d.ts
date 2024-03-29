import {UserDocument} from "../models/User";
import {Request} from "express";


declare global {
  namespace Express {
    export interface Request {
      user: UserDocument
    }
  }
}
