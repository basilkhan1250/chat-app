"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../utils/firebaseConfig";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // ✅ Fetch Firestore user data
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    let userData = { uid: user.uid, email: user.email, displayName: user.displayName };

                    if (userDoc.exists()) {
                        userData = { ...userData, ...userDoc.data() };
                    }

                    setCurrentUser(userData);

                    // ✅ Load contacts
                    const snapshot = await getDocs(collection(db, "users", user.uid, "contacts"));
                    const contactsList = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setContacts(contactsList);
                } catch (err) {
                    console.error("Error fetching user/contacts:", err);
                    setContacts([]);
                }
            } else {
                setCurrentUser(null);
                setContacts([]);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <ChatContext.Provider
            value={{ currentUser, contacts, setContacts, loading }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
