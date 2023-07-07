import { join } from 'path';
import { Dialect } from 'sequelize';
import { SequelizeOptions } from 'sequelize-typescript';

const databaseConfig = (): SequelizeOptions => {

    let dbconfig: SequelizeOptions = {
        database: process.env.DB!,
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        dialect: process.env.DB_DIALECT! as Dialect,
        logging: (/true/i).test(process.env.DB_LOGGING!),
        define: {
            timestamps: (/true/i).test(process.env.DB_TIMESTAMPS!),
            underscored: (/true/i).test(process.env.DB_UNDERSCORED!)
        }
    };
    
    if (process.env.NODE_ENV === 'env.test') {
        dbconfig = {
            ...dbconfig,
            storage: join(__dirname, '../../', process.env.DB_STORAGE!)
        };
    } else {
        dbconfig = {
            ...dbconfig,
            host: process.env.DB_HOST!,
            port: Number(process.env.DB_PORT)
        };
    }

    return dbconfig;
}

export default databaseConfig;
