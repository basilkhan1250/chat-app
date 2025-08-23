"use client";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useChat } from "../Context/ContextData";
import { db } from "../../../utils/firebaseConfig";

const ContactsList = ({ onSelect, selected }) => {
    const { currentUser, contacts, setContacts } = useChat();

    useEffect(() => {
        if (!currentUser) return;

        const unsub = onSnapshot(
            collection(db, "users", currentUser.uid, "contacts"),
            (snapshot) => {
                const contactList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // ✅ Sort contacts by lastMessageTime (latest first)
                const sorted = contactList.sort((a, b) => {
                    if (!a.lastMessageTime) return 1;
                    if (!b.lastMessageTime) return -1;
                    return (
                        b.lastMessageTime.toMillis() -
                        a.lastMessageTime.toMillis()
                    );
                });

                setContacts(sorted);
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
                        key={c.id}
                        onClick={() => onSelect(c)}
                        className={`cursor-pointer p-3 border-b hover:bg-gray-700 ${selected?.id === c.id ? "bg-gray-800" : ""
                            }`}
                    >
                        <p className="font-semibold">
                            {c.displayName || c.userName || "Unnamed Contact"}
                        </p>
                        {c.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                                {c.lastMessage}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactsList;
