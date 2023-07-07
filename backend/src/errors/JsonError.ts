import { Request, Response } from 'express';

function getErrorName(status: number) {
    switch (status) {
        case 200:
            return 'OK';
        case 400:
            return 'Bad Request';
        case 404:
            return 'Not Found';
        case 409:
            return 'Conflict';
        case 500:
            return 'Internal Server Error';
        default:
            return 'Undefined';
    }
}

function JsonError(request: Request, response: Response, message: string) {
    const error = {
        timestamp: new Date().toISOString(),
        status: response.statusCode,
        error: getErrorName(response.statusCode),
        message,
        path: request.path,
        method: request.method
    };
    return error;
}

export default JsonError;
