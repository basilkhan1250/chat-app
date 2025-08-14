"use client"
import Image from "next/image";

import React, { useState, useRef, useEffect } from "react";
import pfp from "@/app/assets/basil.jpeg"; // Assuming you have a profile picture at this path

const Chats = () => {
    const [selectedUserName, setSelectedUserName] = useState("Rin"); // default selected user

    const [messages, setMessages] = useState([
        { text: "Hey! How are you?", sender: "them", senderName: "Rin", img: pfp },
        { text: "I'm good, thanks! And you?", sender: "me", senderName: "You", },
        { text: "I'm great, just working on some projects.", sender: "them", senderName: "Rin", img: pfp },
    ]);

    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setMessages([...messages, { text: newMessage, sender: "me", senderName: "You" }]);
        setNewMessage("");
    };

    // Auto scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed right-0 mt-[70px] h-[92vh] w-[1400px] flex flex-col bg-gray-500 overflow-hidden">

            {/* Navbar with Sender's Name */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-start shadow-md">
                <Image src={pfp} alt="Profile" className="w-10 h-10 rounded-full" />
                <h2 className="text-xl font-semibold">{selectedUserName || "Chat"}</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div key={i} className={`text-lg text-gray-900 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
                        <span className="font-semibold">{msg.senderName}: </span>
                        <div className={`flex mb-3 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${msg.sender === "me"
                                    ? "bg-blue-500 text-white rounded-br-none"
                                    : "bg-gray-300 text-gray-900 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Scroll to bottom */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
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
        </div>

    );
};

export default Chats;
