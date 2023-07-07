import userService from './userService';

describe('services', () => {
    describe('userService', () => {
        it('should create a new user', async () => {
            const randomNumber = Math.floor(Math.random() * 100000) + 1;
            const user: IUser = {
                username: 'user' + randomNumber,
                password: '12345'
            }
            const response = await userService.create(user);
            expect(response.status).toBe(201);
        });
    });
});
