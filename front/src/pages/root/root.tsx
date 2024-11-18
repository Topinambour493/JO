import {Form, NavLink, Outlet, redirect, useLoaderData, useNavigation, useSubmit} from "react-router-dom";
import { getContacts, createContact } from "../../back-localforage/contacts";
import {ContactType} from "../../types/types";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";

export async function loader({request}: {request: Request}) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const contacts = await getContacts(q);
    return { contacts, q };
}

export async function action() {
    const contact = await createContact("coco", "jezierski");
    return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
    const favorites = useSelector((state: RootState) => state.favorites)
    const { contacts, q } = useLoaderData() as { contacts: ContactType[], q: string };
    const navigation = useNavigation();
    const submit = useSubmit();
    let dispatch = useDispatch();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    useEffect(() => {
        const qElement = document.getElementById("q") as HTMLInputElement;
        qElement.value = q;
    }, [q]);

    return (
        <>
            <div id="sidebar">
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact: ContactType) => {
                              let favorite = favorites.find(id => id === contact.id)
                              return (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            )}
                            )}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail"
                 className={
                     navigation.state === "loading" ? "loading" : ""
                 }
            >
                <Outlet/>
            </div>
        </>
    );
}
