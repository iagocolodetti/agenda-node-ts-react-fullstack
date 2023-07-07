import sessionService from './sessionService';
import userService from './userService';

const MOCK_USER: IUser = {
    username: 'user0',
    password: '12345'
}

describe('services', () => {
    describe('sessionService', () => {
        beforeAll(async () => {
            try {
                await userService.create(MOCK_USER);
            } catch {}
        });

        it('should create a new session', async () => {
            const response = await sessionService.create(MOCK_USER);
            expect(response.status).toBe(200);
            expect(response.headers.authorization).not.toBeNull();
        });
    });
});
