import bcrypt from 'bcrypt';

export default {
    generate(text: string | Buffer): string {
        return bcrypt.hashSync(text, 10);
    },

    check(text: string | Buffer, hash: string): boolean {
        return bcrypt.compareSync(text, hash);
    }
};
