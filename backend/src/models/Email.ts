import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, Default, AutoIncrement, DataType, AllowNull } from 'sequelize-typescript';

import Contact from './Contact';

@Table({ tableName: 'email' })
class Email extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(60))
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
}

export default Email;
