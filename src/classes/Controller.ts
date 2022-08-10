import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../models/User";

export class Controller {
  private documentType: string;
  private documentModel: any;

  constructor(documentType: string, documentModel: any) {
    console.log("1: Type: ", documentType, "Model: ", documentModel);
    this.documentType = documentType;
    this.documentModel = documentModel;
    console.log("2: Type: ", this.documentType, "Model: ", this.documentModel);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    console.log(this);
    try {
      console.log(
        "3: Type: ",
        this.documentType,
        "Model: ",
        this.documentModel
      );
      // Get the User Document from the Protected Request
      const user: UserDocument = req.user;
      // Get the User ID's to query for to query
      const query = [user, process.env.ADMIN_ID];
      // Perform the query and return a list of Documents
      const results = await this.documentModel
        .find({
          user: { $in: query },
        })
        .sort({ name: 1 });

      // Respond with the results from the query
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.log(error);
      console.log(`${this.documentType} ${error}`);
      next(error);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the User Document from the Protected Request
      const user: UserDocument = req.user;

      const query = [user, process.env.ADMIN_ID];
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the User Document from the Protected Request
      const user: UserDocument = req.user;
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the User Document from the Protected Request
      const user: UserDocument = req.user;
    } catch (error) {
      next(error);
    }
  }
}
