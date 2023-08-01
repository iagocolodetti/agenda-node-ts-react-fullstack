import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import User from '../models/User';

import JsonError from '../errors/JsonError';

export default {
    async create(request: Request, response: Response) {
        try {
            const { username, password } = request.body;
            await User.create({ username, password });
            response.sendStatus(201);
        } catch (error: ValidationError | any) {
            if (error instanceof ValidationError) {
                const err = error as ValidationError;
                if (err.name === 'SequelizeUniqueConstraintError') {
                    response.status(409);
                    response.json(JsonError(request, response, 'Usuário já existe'));
                } else {
                    response.status(400);
                    response.json(JsonError(request, response, err.message.replace('Validation error: ', '')));
                }
            } else {
                response.status(500);
                response.json(JsonError(request, response, 'Não foi possível criar o usuário'));
            }
        }
    }
};
