import {Form, useLoaderData} from "react-router-dom";
import Swal from 'sweetalert2';
import {ContactType} from "../../types/types";
import {updateContact, getContact} from "../../back-localforage/contacts";
import Favorite from "../../components/favorite/favorite";
import React from "react";

export async function loader({ params } : {params: {contactId: string} }) {
    const contact = await getContact(params.contactId);
    return { contact };
}

export async function action({ request, params }: {request: Request, params: { contactId: string } }) {
    const formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}

export default function Contact() {
    const { contact } = useLoaderData() as {contact: ContactType};

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await Swal.fire({
            title: 'Confirmation',
            text: 'Please confirm you want to delete this record.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
        });

        if (result.isConfirmed) {
            // Convertir event.target en formulaire HTML
            const form = event.target as HTMLFormElement;
            form.submit();
        }
    };


    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={
                        contact.avatar
                    }
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>
                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit" method="get">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        action="destroy"

                        method={"post"}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}


