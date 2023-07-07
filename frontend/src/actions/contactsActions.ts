import { IContact } from "../interfaces/IContact";

function addContact(contact: IContact) {
    return {
        type: "ADD_CONTACT",
        contact
    };
}
  
function setContacts(contacts: IContact[] | null = []) {
    return {
        type: "SET_CONTACTS",
        contacts
    };
}
  
function destroyContact(id: number) {
    return {
        type: "DESTROY_CONTACT",
        id
    };
}
  
const methods = {
    addContact,
    setContacts,
    destroyContact
};
  
export default methods;
  