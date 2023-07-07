import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import AuthenticationError from '../errors/AuthenticationError';

const JWT_SECRET = 'MeuSegredo123';
const JWT_TOKEN_PREFIX = 'Bearer';

export default {
    getToken(id: number, username: string, expiration: number) {
        const dateNow = Math.floor(Date.now() / 1000);
        const token = jwt.sign({
            iss: 'agenda',
            jti: id,
            sub: username,
            iat: dateNow,
            exp: dateNow + (expiration / 1000)
        }, JWT_SECRET, { algorithm: 'HS512' });
        return `${JWT_TOKEN_PREFIX} ${token}`;
    },

    getIdFromToken(token: string) {
        if (token) {
            const _token = token.replace(`${JWT_TOKEN_PREFIX} `, '');
            let id: number;
            jwt.verify(_token, JWT_SECRET, (error, decoded) => {
                if (error) {
                    switch (error.name) {
                        case 'TokenExpiredError':
                            throw new AuthenticationError(401, 'Token de autenticação expirado');
                        case 'JsonWebTokenError':
                            throw new AuthenticationError(401, 'Token de autenticação inválido');
                    }
                } else {
                    id = Number((decoded as JwtPayload).jti);
                }
            });
            return id!;
        } else {
            throw new AuthenticationError(400, 'Token de autenticação não informado no cabeçalho');
        }
    }
};
