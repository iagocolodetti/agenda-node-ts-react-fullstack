import { IContact } from "../interfaces/IContact";

function setContact(contact: IContact | null = null) {
    return {
        type: "SET_CONTACT",
        contact
    };
}

const methods = {
    setContact
};

export default methods;
