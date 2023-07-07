import { Table, Column, Model, PrimaryKey, ForeignKey, Default, AutoIncrement, DataType, AllowNull, HasMany } from 'sequelize-typescript';

import User from './User';
import Phone from './Phone';
import Email from './Email';

@Table({ tableName: 'contact' })
class Contact extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(45))
    name!: string;

    @AllowNull(false)
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
}

export default Contact;
