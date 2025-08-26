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
        <div className="h-full flex flex-col">
            <h2 className="px-4 py-3 text-xl font-bold bg-gray-800 text-white border-b border-gray-700">
                Contacts
            </h2>
            {contacts.length === 0 && (
                <p className="p-4 text-gray-400">No contacts yet.</p>
            )}
            <ul className="flex-1 overflow-y-auto">
                {contacts.map((c) => (
                    <li
                        key={c.id}
                        onClick={() => onSelect(c)}
                        className={`cursor-pointer px-4 py-3 flex flex-col border-b border-gray-700 transition-colors ${
                            selected?.id === c.id
                                ? "bg-gray-700"
                                : "hover:bg-gray-800"
                        }`}
                    >
                        <span className="font-semibold text-white">
                            {c.displayName || c.userName || "Unnamed Contact"}
                        </span>
                        {c.lastMessage && (
                            <span className="text-sm text-gray-400 truncate">
                                {c.lastMessage}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactsList;
