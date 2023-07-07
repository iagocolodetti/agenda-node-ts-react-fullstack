import api from './api';

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
