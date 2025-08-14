"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import pfp from "@/app/assets/basil.jpeg";

const Chats = () => {
    const people = [
        { name: "Rin", img: pfp },
        { name: "Alex", img: pfp },
        { name: "Maya", img: pfp },
    ];

    const [selectedUserName, setSelectedUserName] = useState(people[0].name);

    const [chatHistories, setChatHistories] = useState({
        Rin: [
            { text: "Hey! How are you?", sender: "them", senderName: "Rin", img: pfp },
            { text: "I'm good, thanks! And you?", sender: "me", senderName: "You" },
            { text: "I'm great, just working on some projects.", sender: "them", senderName: "Rin", img: pfp },
        ],
        Alex: [
            { text: "Yo Alex!", sender: "me", senderName: "You" },
            { text: "Hey! Long time no see!", sender: "them", senderName: "Alex", img: pfp },
        ],
        Maya: [
            { text: "Hi Maya!", sender: "me", senderName: "You" },
            { text: "Hello! How's it going?", sender: "them", senderName: "Maya", img: pfp },
        ],
    });

    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Sidebar width state
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const isResizing = useRef(false);

    const startResizing = () => {
        isResizing.current = true;
    };

    const stopResizing = () => {
        isResizing.current = false;
    };

    const handleMouseMove = (e) => {
        if (isResizing.current) {
            const newWidth = e.clientX;
            if (newWidth > 150 && newWidth < 600) { // min/max width
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

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setChatHistories((prev) => ({
            ...prev,
            [selectedUserName]: [
                ...prev[selectedUserName],
                { text: newMessage, sender: "me", senderName: "You" }
            ]
        }));
        setNewMessage("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistories, selectedUserName]);

    return (
        <div className="fixed top-[70px] right-0 h-[92vh] w-full flex bg-gray-200">
            
            {/* Sidebar (People List) */}
            <div
                className="bg-gray-900 text-white overflow-y-auto"
                style={{ width: sidebarWidth }}
            >
                <h2 className="p-4 font-bold text-lg border-b border-gray-700">Chats</h2>
                {people.map((person, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedUserName(person.name)}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 ${selectedUserName === person.name ? "bg-gray-800" : ""}`}
                    >
                        <Image src={person.img} alt={person.name} width={40} height={40} className="rounded-full" />
                        <span className="font-medium">{person.name}</span>
                    </div>
                ))}
            </div>

            {/* Drag Handle */}
            <div
                onMouseDown={startResizing}
                className="w-1 bg-gray-600 cursor-col-resize hover:bg-gray-500"
            ></div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-500 overflow-hidden">
                {/* Navbar with selected user */}
                <div className="bg-gray-800 text-white p-4 flex items-center gap-3 shadow-md">
                    <Image src={pfp} alt="Profile" width={40} height={40} className="rounded-full" />
                    <h2 className="text-xl font-semibold">{selectedUserName || "Chat"}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {chatHistories[selectedUserName]?.map((msg, i) => (
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
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
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
        </div>
    );
};

export default Chats;
