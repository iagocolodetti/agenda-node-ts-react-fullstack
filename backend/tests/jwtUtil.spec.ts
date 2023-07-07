import AuthenticationError from '../src/errors/AuthenticationError';
import jwtUtil from '../src/utils/jwtUtil';

const MOCK_ID = 1;
const MOCK_USERNAME = 'User';
const EXPIRATION = 1000;

let TOKEN = '';

describe('utils', () => {
    describe('jwtUtil', () => {
        it('should generate a token', () => {
            TOKEN = jwtUtil.getToken(MOCK_ID, MOCK_USERNAME, EXPIRATION);
            expect(TOKEN.length).not.toEqual(0);
        });

        it('should check if token is valid and return correct id', () => {
            const id = jwtUtil.getIdFromToken(TOKEN);
            expect(id).toStrictEqual(MOCK_ID);
        });

        it('should check if token expired correctly', (done) => {
            setTimeout(() => {
                try {
                    done();
                    jwtUtil.getIdFromToken(TOKEN);
                } catch (error: AuthenticationError | any) {
                    expect(error.status).toEqual(401);
                }
            }, EXPIRATION + 100);
        });
    });
});
