import { Sequelize } from 'sequelize-typescript';

import dbconfig from '../configs/database';

import User from '../models/User';
import Contact from '../models/Contact';
import Phone from '../models/Phone';
import Email from '../models/Email';

const sequelize = new Sequelize(dbconfig());

export default {
    async connect() {
        try {
            await sequelize.authenticate();
            sequelize.addModels([User, Contact, Phone, Email]);
            console.log('Conexão com o banco de dados estabelecida.');
        } catch {
            console.log('Não foi possível estabelecer a conexão com o banco de dados.');
        }
    },
    
    async close() {
        await sequelize.close();
        console.log('Conexão com o banco de dados encerrada.');
    },

    async getTransaction() {
        return await sequelize.transaction();
    }
};
