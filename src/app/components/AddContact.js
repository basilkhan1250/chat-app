"use client";

import { useState } from "react";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { useChat } from "../Context/ContextData";
import { db } from "../../../utils/firebaseConfig";

const AddContact = () => {
    const [contactNumber, setContactNumber] = useState("");
    const [customName, setCustomName] = useState("");
    const { currentUser, setContacts } = useChat();

    const handleAdd = async () => {
        if (!contactNumber.trim() || !customName.trim() || !currentUser) return;

        try {
            const formattedNumber = contactNumber.trim();

            // 🔍 Look up the user in Firestore (users collection)
            const q = query(
                collection(db, "users"),
                where("contactNumber", "==", formattedNumber)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("User not found!");
                return;
            }

            const targetDoc = querySnapshot.docs[0];
            const targetData = targetDoc.data();

            // 🛑 Prevent adding yourself
            if (targetData.uid === currentUser.uid) {
                alert("You cannot add yourself!");
                return;
            }

            // ➕ Save contact in Firestore under currentUser's contacts
            const contactRef = doc(
                db,
                "users",
                currentUser.uid,
                "contacts",
                targetData.uid
            );

            await setDoc(contactRef, {
                uid: targetData.uid,
                userName: targetData.userName || "",
                contactNumber: targetData.contactNumber || "",
                displayName: customName || targetData.userName,
            });

            // 🟢 Update local state so UI refreshes
            setContacts((prev) => [
                ...prev.filter((c) => c.uid !== targetData.uid), // avoid duplicates
                {
                    uid: targetData.uid,
                    userName: targetData.userName || "",
                    contactNumber: targetData.contactNumber || "",
                    displayName: customName || targetData.userName,
                },
            ]);

            setContactNumber("");
            setCustomName("");
        } catch (err) {
            console.error("Error adding contact:", err);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-2">
            <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="border p-2 rounded"
            />

            <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter a name for this contact"
                className="border p-2 rounded"
            />

            <button
                onClick={handleAdd}
                className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded"
            >
                Add Contact
            </button>
        </div>
    );
};

export default AddContact;
