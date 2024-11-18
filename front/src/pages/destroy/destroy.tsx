import {redirect, useParams} from "react-router-dom";
import { deleteContact } from "../../back-localforage/contacts";

export async function action({ params } : { params : { contactId: string } }) {
    await deleteContact(params.contactId);
    return redirect("/");
}
