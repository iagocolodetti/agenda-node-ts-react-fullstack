import { Table, Column, Model, PrimaryKey, ForeignKey, Default, AutoIncrement, DataType, AllowNull, HasMany, AfterCreate, CreatedAt, UpdatedAt, DefaultScope, Length } from 'sequelize-typescript';

import User from './User';
import Phone from './Phone';
import Email from './Email';

@DefaultScope(() => ({
    include: [{
        model: Phone,
        as: Phone.tableName
    },{
        model: Email,
        as: Email.tableName
    }],
    attributes: ['id', 'name', 'alias']
}))
@Table({ tableName: 'contact' })
class Contact extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Length({ msg: 'O campo destinado ao nome do contato deve ter de 3 à 45 caracteres', min: 3, max: 45 })
    @Column(DataType.STRING(45))
    name!: string;

    @AllowNull(false)
    @Length({ msg: 'O campo destinado ao apelido do contato deve ter de 3 à 20 caracteres', min: 3, max: 20 })
    @Column(DataType.STRING(20))
    alias!: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(process.env.NODE_ENV === 'env.test' ? DataType.INTEGER : DataType.INTEGER.UNSIGNED)
    user_id!: number;

    @AllowNull(true)
    @Default(0)
    @Column(DataType.BOOLEAN)
    deleted!: boolean;

    @HasMany(() => Phone, 'contact_id')
    phone!: Phone[];

    @HasMany(() => Email, 'contact_id')
    email!: Email[];
    
    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;

    @AfterCreate
    static excludeFields(contact: Contact) {
        const { dataValues } = contact;
        delete dataValues.user_id;
        delete dataValues.deleted;
        delete dataValues.created_at;
        delete dataValues.updated_at;
    }
}

export default Contact;
