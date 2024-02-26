import {Request, Response, Router} from 'express';
import {validator_productOrdered} from "../utils/validators";
import {validationResult} from "express-validator";
import {Op} from "sequelize";
import {
    HTTP_BAD_REQUEST,
    HTTP_CONFLICT,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
    HTTP_UPDATED
} from "../utils/httpCode";
import User from '../config/models/user.model';

const router = Router();

export default router;