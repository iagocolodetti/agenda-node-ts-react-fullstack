export default class AuthenticationError extends Error {
    
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || 500;
    }
};
