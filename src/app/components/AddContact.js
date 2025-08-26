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
            const q = query(
                collection(db, "users"),
                where("contactNumber", "==", contactNumber.trim())
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert("User not found!");
                return;
            }

            const targetDoc = querySnapshot.docs[0];
            const targetData = targetDoc.data();

            if (targetData.uid === currentUser.uid) {
                alert("You cannot add yourself!");
                return;
            }

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

            setContacts((prev) => [
                ...prev.filter((c) => c.uid !== targetData.uid),
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
        <div className="p-6 bg-gray-100 rounded-lg shadow-md space-y-4">
            <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400"
            />

            <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter a name for this contact"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400"
            />

            <button
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition cursor-pointer"
            >
                Add Contact
            </button>
        </div>
    );
};

export default AddContact;
