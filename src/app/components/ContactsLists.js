"use client";

import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useChat } from "../Context/ContextData";
import { db } from "../../../utils/firebaseConfig";

const ContactsList = ({ onSelect }) => {
    const { currentUser, contacts, setContacts } = useChat();

    useEffect(() => {
        if (!currentUser) return;

        // 🔥 Listen to real-time updates of user's contacts
        const unsub = onSnapshot(
            collection(db, "users", currentUser.uid, "contacts"),
            (snapshot) => {
                const contactList = snapshot.docs.map((doc) => doc.data());
                setContacts(contactList);
            }
        );

        return () => unsub();
    }, [currentUser, setContacts]);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Contacts</h2>
            {contacts.length === 0 && <p>No contacts yet.</p>}
            <ul>
                {contacts.map((c) => (
                    <li
                        key={c.uid}
                        onClick={() => onSelect(c)}
                        className="cursor-pointer p-2 border-b hover:bg-gray-100"
                    >
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-gray-600">{c.contactNumber}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactsList;
