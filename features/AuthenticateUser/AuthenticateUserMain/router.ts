import express from 'express';
import type { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import type { NextHandleFunction } from "connect";
import BadRequestError from '../../../services/errors/BadRequestError';
import UnauthorisedActionError from '../../../services/errors/UnauthorisedActionError';

const AuthenticateUserRouter: Router = express.Router();
const jsonParser: NextHandleFunction = bodyParser.json();

AuthenticateUserRouter.post("/", jsonParser, async (request: Request, response: Response) => {
    try {

        
        
    } catch(error) {
        if (error instanceof BadRequestError) {
            response.status(422)
            .json(error.getMessage());
        } else if(error instanceof UnauthorisedActionError) {
            response.status(403)
            .json(error.getMessage());
        } else {
            throw error;
        }
    }
});

export { AuthenticateUserRouter }