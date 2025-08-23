"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import pfp from "@/app/assets/basil.jpeg";
import ContactsList from "./components/ContactsLists";
import { useChat } from "./Context/ContextData";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    doc,
    setDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

const Chats = () => {
    const { currentUser } = useChat();
    const [selectedContact, setSelectedContact] = useState(null);
    const [chatHistories, setChatHistories] = useState({});
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const [sidebarWidth, setSidebarWidth] = useState(300);
    const isResizing = useRef(false);

    const startResizing = () => (isResizing.current = true);
    const stopResizing = () => (isResizing.current = false);

    const handleMouseMove = (e) => {
        if (isResizing.current) {
            const newWidth = e.clientX;
            if (newWidth > 150 && newWidth < 600) {
                setSidebarWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, []);

    // 🔥 Send message to Firestore + update both users' contacts
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact || !currentUser) return;

        const chatId =
            currentUser.uid < selectedContact.id
                ? `${currentUser.uid}_${selectedContact.id}`
                : `${selectedContact.id}_${currentUser.uid}`;

        try {
            // Save message
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage,
                senderId: currentUser.uid,
                senderName: currentUser.displayName || "Me",
                timestamp: serverTimestamp(),
            });

            // Update "last message" for current user
            await setDoc(
                doc(db, "users", currentUser.uid, "contacts", selectedContact.id),
                {
                    id: selectedContact.id,
                    displayName:
                        selectedContact.displayName ||
                        selectedContact.userName ||
                        "Contact",
                    lastMessage: newMessage,
                    lastMessageTime: serverTimestamp(),
                },
                { merge: true }
            );

            // Update "last message" for receiver
            await setDoc(
                doc(db, "users", selectedContact.id, "contacts", currentUser.uid),
                {
                    id: currentUser.uid,
                    displayName: currentUser.displayName || "Me",
                    lastMessage: newMessage,
                    lastMessageTime: serverTimestamp(),
                },
                { merge: true }
            );

            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // 🔄 Listen for messages
    useEffect(() => {
        if (!selectedContact || !currentUser) return;

        const chatId =
            currentUser.uid < selectedContact.id
                ? `${currentUser.uid}_${selectedContact.id}`
                : `${selectedContact.id}_${currentUser.uid}`;

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setChatHistories((prev) => ({
                ...prev,
                [selectedContact.id]: msgs,
            }));
        });

        return () => unsub();
    }, [selectedContact, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistories, selectedContact]);

    return (
        <div className="fixed top-[70px] right-0 h-[92vh] w-full flex bg-gray-200">
            {/* Sidebar */}
            <div
                className="bg-gray-900 text-white overflow-y-auto"
                style={{ width: sidebarWidth }}
            >
                <h1 className="p-4 font-bold text-2xl border-b border-gray-700">
                    {currentUser?.displayName || "Chats"}
                </h1>
                <ContactsList
                    onSelect={setSelectedContact}
                    selected={selectedContact}
                />
            </div>

            {/* Drag Handle */}
            <div
                onMouseDown={startResizing}
                className="w-1 bg-gray-600 cursor-col-resize hover:bg-gray-500"
            ></div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-500 overflow-hidden">
                {/* Navbar */}
                <div className="bg-gray-800 text-white p-4 flex items-center gap-3 shadow-md">
                    <Image
                        src={pfp}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <h2 className="text-xl font-semibold">
                        {selectedContact?.displayName ||
                            selectedContact?.userName ||
                            "Chat"}
                    </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {selectedContact &&
                        chatHistories[selectedContact.id]?.map((msg) => (
                            <div
                                key={msg.id}
                                className={`text-lg text-gray-900 ${
                                    msg.senderId === currentUser.uid
                                        ? "text-right"
                                        : "text-left"
                                }`}
                            >
                                <span className="font-semibold">
                                    {msg.senderName}:{" "}
                                </span>
                                <div
                                    className={`flex mb-3 ${
                                        msg.senderId === currentUser.uid
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                                            msg.senderId === currentUser.uid
                                                ? "bg-blue-500 text-white rounded-br-none"
                                                : "bg-gray-300 text-gray-900 rounded-bl-none"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {selectedContact && (
                    <form
                        onSubmit={sendMessage}
                        className="bg-gray-700 p-2 border-t border-gray-500 flex items-center w-full"
                    >
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-2 rounded-lg border border-gray-100 bg-gray-300 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="ml-2 px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Chats;
