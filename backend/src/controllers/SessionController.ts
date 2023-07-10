import { Request, Response } from 'express';

import User from '../models/User';

import hashGenerator from '../utils/hashGenerator';
import jwtUtil from '../utils/jwtUtil';

import JsonError from '../errors/JsonError';

export default {
    async create(request: Request, response: Response) {
        try {
            const { username, password } = request.body;
            if (!username || !password) {
                response.status(400);
                return response.send(JsonError(request, response, '\'username\' e \'password\' são obrigatórios no corpo da requisição'));
            }
            const result = await User.findOne({ where: { username: username.toLowerCase() }, raw: true });
            if (result && hashGenerator.check(password, result.password)) {
                const dateNow = new Date().getTime();
                const expiration = 1000 * 60 * 60;
                response.setHeader('Authorization', jwtUtil.getToken(result.id, result.username, expiration));
                response.setHeader('Expires', new Date(dateNow + expiration).toUTCString());
                response.sendStatus(200);
            } else {
                response.status(404);
                response.json(JsonError(request, response, 'Usuário não encontrado ou senha incorreta'));
            }
        } catch (error: any) {
            response.status(500);
            response.json(JsonError(request, response, 'Não foi possível efetuar o login'));
        }
    }
};
