import api from './api';

import { IUser } from '../interfaces/IUser';

async function create(user: IUser) {
    try {
        return await api.post('/users', JSON.stringify(user));
    } catch (error: any) {
        throw error;
    }
}

const methods = {
    create
};

export default methods;
