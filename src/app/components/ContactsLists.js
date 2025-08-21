"use client";

import { useEffect } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { useChat } from "../Context/ContextData";
import { db } from "../../../utils/firebaseConfig";

const ContactsList = ({ onSelect }) => {
    const { currentUser, contacts, setContacts } = useChat();

    useEffect(() => {
        if (!currentUser) return;

        // ✅ Listen for all contacts under current user
        const unsub = onSnapshot(
            collection(db, "users", currentUser.uid, "contacts"),
            (snapshot) => {
                const contactList = snapshot.docs.map((doc) => ({
                    id: doc.id, // contact UID (if you saved it correctly in AddContact)
                    ...doc.data(),
                }));

                // ✅ Remove duplicates by `id`
                const uniqueContacts = Array.from(
                    new Map(contactList.map((c) => [c.id, c])).values()
                );

                setContacts(uniqueContacts);
            }
        );

        return () => unsub();
    }, [currentUser, setContacts]);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Contacts</h2>
            {contacts.length === 0 && <p>No contacts yet.</p>}
            <ul>
                {contacts.map((c, i) => (
                    <li
                        key={i}
                        onClick={() => onSelect(c)}
                        className="cursor-pointer p-2 border-b hover:bg-gray-100"
                    >
                        <p className="font-semibold">
                            {c.displayName || c.userName || "Unnamed Contact"}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactsList;
