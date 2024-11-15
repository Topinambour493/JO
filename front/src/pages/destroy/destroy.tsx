import { redirect } from "react-router-dom";
import { deleteContact } from "../../back-localforage/contacts";

export async function action({ params } : { params : { contactId: string } }) {
    let a = await deleteContact(params.contactId);
    console.log(a)
    return redirect("");
}
