import contactService from './contactService';
import userService from './userService';
import sessionService from './sessionService';
import { IContact } from '../interfaces/IContact';
import { IUser } from '../interfaces/IUser';

let AUTHORIZATION = '';

const MOCK_USER: IUser = {
    username: 'user0',
    password: '12345'
};

const MOCK_CONTACT: IContact = {
    name: 'Name1',
    alias: 'Alias1',
    phone: [{
        phone: '1111-1111'
    },{
        phone: '2222-2222'
    },{
        phone: '3333-3333'
    },{
        phone: '4444-4444'
    },{
        phone: '5555-5555'
    }],
    email: [{
        email: 'email@gmail.com'
    },{
        email: 'email@hotmail.com'
    },{
        email: 'email@yahoo.com'
    },{
        email: 'email@aaaaa.com'
    },{
        email: 'email@bbbbb.com'
    }]
};

let LAST_CONTACT: IContact | null = null;

describe('services', () => {
    describe('contactService', () => {
        beforeAll(async () => {
            try {
                await userService.create(MOCK_USER);
            } catch {}
            try {
                const response = await sessionService.create(MOCK_USER);
                AUTHORIZATION = response.headers.authorization;
            } catch {}
        });

        it('should create a new contact', async () => {
            const response = await contactService.create(AUTHORIZATION, MOCK_CONTACT);
            expect(response.status).toBe(201);
        });

        it('should read contact list', async () => {
            const response = await contactService.read(AUTHORIZATION);
            LAST_CONTACT = response.data.slice(-1)[0];
            expect(response.status).toBe(200);
        });

        it('should update a contact', async () => {
            const response = await contactService.update(AUTHORIZATION, LAST_CONTACT!);
            expect(response.status).toBe(204);
        });

        it('should delete a contact', async () => {
            const response = await contactService.destroy(AUTHORIZATION, LAST_CONTACT!.id!);
            expect(response.status).toBe(204);
        });
    });
});
