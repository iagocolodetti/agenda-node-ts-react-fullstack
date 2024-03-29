import { ValidationError } from 'sequelize';
import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique, DataType, AllowNull, AfterCreate, CreatedAt, UpdatedAt, Length, DefaultScope, BeforeCreate } from 'sequelize-typescript';

import hashGenerator from '../utils/hashGenerator';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 45;
const PASSWORD_MIN_LENGTH = 3;
const PASSWORD_MAX_LENGTH = 32;

@DefaultScope(() => ({
    attributes: {
        exclude: ['created_at', 'updated_at']
    }
}))
@Table({ tableName: 'user' })
class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Unique
    @Length({ msg: `O campo destinado ao nome de usuário deve ter de ${USERNAME_MIN_LENGTH} à ${USERNAME_MAX_LENGTH} caracteres`, min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH })
    @Column(DataType.STRING(45))
    username!: string;

    @AllowNull(false)
    @Column(DataType.STRING(60))
    password!: string;

    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;

    @BeforeCreate
    static usernameToLowerCase(user: User) {
        const { dataValues } = user;
        if (dataValues.password.length < PASSWORD_MIN_LENGTH || dataValues.password.length > PASSWORD_MAX_LENGTH) {
            throw new ValidationError(`O campo destinado a senha deve ter de ${PASSWORD_MIN_LENGTH} à ${PASSWORD_MAX_LENGTH} caracteres`, []);
        } else {
            dataValues.username = dataValues.username.toLowerCase();
            dataValues.password = hashGenerator.generate(dataValues.password);
        }
    }

    @AfterCreate
    static excludeFields(user: User) {
        const { dataValues } = user;
        delete dataValues.created_at;
        delete dataValues.updated_at;
    }
}

export default User;
