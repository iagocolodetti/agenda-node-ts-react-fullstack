import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, Default, AutoIncrement, DataType, AllowNull, AfterCreate, CreatedAt, UpdatedAt, Length, DefaultScope } from 'sequelize-typescript';

import Contact from './Contact';

@DefaultScope(() => ({
    where: { deleted: false },
    attributes: ['id', 'phone']
}))
@Table({ tableName: 'phone' })
class Phone extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Length({ msg: 'O campo destinado ao telefone deve ter de 3 à 20 caracteres', min: 3, max: 20 })
    @Column(DataType.STRING(20))
    phone!: string;

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
    static excludeFields(phone: Phone) {
        const { dataValues } = phone;
        delete dataValues.contact_id;
        delete dataValues.deleted;
        delete dataValues.created_at;
        delete dataValues.updated_at;
    }
}

export default Phone;
