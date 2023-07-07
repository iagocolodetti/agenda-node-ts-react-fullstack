import api from './api';

async function create(authorization: string, contact: IContact) {
    try {
        return await api.post('/contacts', JSON.stringify(contact), { headers: { 'Authorization': authorization } });
    } catch (error: any) {
        throw error;
    }
}

async function read(authorization: string) {
    try {
        return await api.get('/contacts', { headers: { 'Authorization': authorization } });
    } catch (error: any) {
        throw error;
    }
}

async function update(authorization: string, contact: IContact) {
    try {
        return await api.put(`/contacts/${contact.id}`, JSON.stringify(contact), { headers: { 'Authorization': authorization } });
    } catch (error: any) {
        throw error;
    }
}

async function destroy(authorization: string, id: number) {
    try {
        return await api.delete(`/contacts/${id}`, { headers: { 'Authorization': authorization } });
    } catch (error: any) {
        throw error;
    }
}

const methods = {
    create,
    read,
    update,
    destroy
}

export default methods;
