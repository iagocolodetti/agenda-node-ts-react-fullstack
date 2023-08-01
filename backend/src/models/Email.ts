import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, Default, AutoIncrement, DataType, AllowNull, AfterCreate, CreatedAt, UpdatedAt, DefaultScope, Is } from 'sequelize-typescript';
import { ValidationError } from 'sequelize'; 

import Contact from './Contact';

const EMAIL_VALIDATION = {
    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
    nameMaxLength: 64,
    addressMaxLength: 190
};

@DefaultScope(() => ({
    where: { deleted: false },
    attributes: ['id', 'email']
}))
@Table({ tableName: 'email' })
class Email extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Is('ValidEmail', (value) => {
        const email = value.split('@');
        if (!EMAIL_VALIDATION.pattern.test(value) || email[0].length > EMAIL_VALIDATION.nameMaxLength || email[1].length > EMAIL_VALIDATION.addressMaxLength) {
            throw new ValidationError(`'${value}' não é um e-mail válido`, []);
        }
    })
    @Column(DataType.STRING(255))
    email!: string;

    @AllowNull(false)
    @ForeignKey(() => Contact)
    @Column(process.env.NODE_ENV === 'env.test' ? DataType.INTEGER : DataType.INTEGER.UNSIGNED)
    contact_id!: number;

    @BelongsTo(() => Contact)
    contact!: Contact;

    @AllowNull(true)
    @Default(0)
    @Column(DataType.BOOLEAN)
    deleted!: boolean;
    
    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;

    @AfterCreate
    static excludeFields(email: Email) {
        const { dataValues } = email;
        delete dataValues.contact_id;
        delete dataValues.deleted;
        delete dataValues.created_at;
        delete dataValues.updated_at;
    }
}

export default Email;
