import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getContacts(query) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await getLocalContacts();
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact(first, last) {
    await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now(), favorite: false, first, last, avatar: "4", "notes" : "test"};
    let contacts = await getLocalContacts();
    contacts.unshift(contact);
    set(contacts);
    return contact;
}

export async function getContact(id) {
    await fakeNetwork(`contact:${id}`);
    let contacts = await getLocalContacts();
    let contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
}

export async function updateContact(id, updates) {
    await fakeNetwork();
    let contacts = await getLocalContacts();
    let contact = contacts.find(contact => contact.id === id);
    if (!contact) throw new Error("No contact found for", id);
    Object.assign(contact, updates);
    set(contacts);
    return contact;
}

export async function deleteContact(id) {
    let contacts = await getLocalContacts();
    let index = contacts.findIndex(contact => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        set(contacts);
        return true;
    }
    return false;
}

async function getLocalContacts(){
    return await JSON.parse(localStorage.getItem("contacts")) || [];
}

function set(contacts) {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
    if (!key) {
        fakeCache = {};
    }

    if (fakeCache[key]) {
        return;
    }

    fakeCache[key] = true;
    return new Promise(res => {
        setTimeout(res, Math.random() * 800);
    });
}