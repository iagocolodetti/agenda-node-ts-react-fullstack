import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique, DataType, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'user' })
class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(45))
    username!: string;

    @AllowNull(false)
    @Column(DataType.STRING(60))
    password!: string;
}

export default User;
