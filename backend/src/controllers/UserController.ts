import { Request, Response } from 'express';

import User from '../models/User';

import hashGenerator from '../utils/hashGenerator';

import JsonError from '../errors/JsonError';

export default {
    async create(request: Request, response: Response) {
        try {
            const { username, password } = request.body;
            if (!username || !password) {
                response.status(400);
                return response.send(JsonError(request, response, '\'username\' e \'password\' são obrigatórios no corpo da requisição'));
            }
            const hash = hashGenerator.generate(password)
            await User.create({ username: username.toLowerCase(), password: hash });
            response.sendStatus(201);
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                response.status(409);
                response.json(JsonError(request, response, 'Usuário já existe'));
            } else {
                response.status(500);
                response.json(JsonError(request, response, 'Não foi possível criar o usuário'));
            }
        }
    }
};
