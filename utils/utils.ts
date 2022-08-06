import jwt, {JwtPayload} from "jsonwebtoken";

import {Request} from "express";
import {ErrorResponse} from "./errorResponse";
import User from "../models/User";

export async function getUserFromReq (req: Request){

    // Check the request headers for the authorization token
    const token = req?.headers?.authorization?.split(" ")[1] ?? ""

    // Check if a token has been provided
    if (!token.length){
        throw new ErrorResponse("Authentication token not provided", 403)
    }

    // Use JSON web token to verify that the token is valid
    const {_id} = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload

    const user = await User.findById(_id)

    // Check if the received User exists
    if (user){
        throw new ErrorResponse("User not found", 404)
    }

    return user
}