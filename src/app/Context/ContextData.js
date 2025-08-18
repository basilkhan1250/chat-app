"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../../utils/firebaseConfig";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const contactUID = user.displayName; // stored at signup
        if (!contactUID) {
          console.warn("⚠️ No contact UID found on user.displayName");
          setCurrentUser(user);
          setContacts([]);
          setLoading(false);
          return;
        }

        setCurrentUser({ ...user, uid: contactUID });

        try {
          const snapshot = await getDocs(
            collection(db, "users", contactUID, "contacts")
          );
          const contactsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setContacts(contactsList);
        } catch (err) {
          console.error("Error fetching contacts:", err);
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
