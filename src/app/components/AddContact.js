"use client";

import { useState } from "react";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { useChat } from "../Context/ContextData";
import { db } from "../../../utils/firebaseConfig";

const AddContact = () => {
    const [contactNumber, setContactNumber] = useState("");
    const { currentUser, setContacts } = useChat();

    const handleAdd = async () => {
        if (!contactNumber || !currentUser) return;

        try {
            // 🔍 Search user by contact number
            const q = query(
                collection(db, "users"),
                where("contactNumber", "==", contactNumber)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("User not found!");
                return;
            }

            // ✅ Get matched user data
            const targetDoc = querySnapshot.docs[0];
            const targetData = targetDoc.data();

            // 🛑 Prevent adding yourself
            if (targetData.uid === currentUser.uid) {
                alert("You cannot add yourself!");
                return;
            }

            // ➕ Add to my contacts
            await setDoc(doc(db, "users", currentUser.uid, "contacts", targetData.uid), {
                uid: targetData.uid,
                name: targetData.name,
                contactNumber: targetData.contactNumber,
            });

            // 🟢 Update local state
            setContacts((prev) => [...prev, targetData]);

            setContactNumber("");
        } catch (err) {
            console.error("Error adding contact:", err);
        }
    };

    return (
        <div className="p-4">
            <input
                type="number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="border p-2 rounded"
            />
            <button
                onClick={handleAdd}
                className="ml-2 cursor-pointer bg-blue-500 text-white px-3 py-1 rounded"
            >
                Add Contact
            </button>
        </div>
    );
};

export default AddContact;
