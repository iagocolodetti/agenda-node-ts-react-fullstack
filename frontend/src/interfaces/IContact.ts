import { IEmail } from "./IEmail";
import { IPhone } from "./IPhone";

interface IContact {
    id?: number,
    name: string;
    alias: string;
    user_id?: number;
    deleted?: boolean;
    email: IEmail[];
    phone: IPhone[];
}

export type { IContact };
