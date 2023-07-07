import { IContact } from "../interfaces/IContact";

function contact(state: IContact | null = null, action: any) {
    switch (action.type) {
        case "SET_CONTACT":
            return action.contact;
        default:
            return state;
    }
}
  
export default contact;
  