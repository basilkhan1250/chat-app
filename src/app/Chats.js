"use client"
import React, { useState } from "react";


const Chats = () => {

    const [messages, setMessages] = useState([
        { text: "Hey! How are you?", sender: "them" },
        { text: "I'm good, thanks! And you?", sender: "me" },
        { text: "I'm great, just working on some projects.", sender: "them" },
    ])


    const [newMessage, setNewMessage] = useState("")

    const sendMessage = (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return;
        setMessages([...messages, { text: newMessage, sender: "me" }])
        setNewMessage("")
    }



    return (
        <>
            <div className="chats h-[85vh] w-[80%] fixed right-0 flex flex-col  mt-[70px]">
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-500">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex mb-3 ${msg.sender === "me" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${msg.sender === "me"
                                    ? "bg-blue-500 text-white rounded-br-none"
                                    : "bg-gray-300 text-gray-900 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div>
                    <form
                        onSubmit={sendMessage}
                        className="fixed bottom-0 right-0 w-[80%] bg-gray-700 p-2 border-t border-gray-500  flex items-center"
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
        </>
    );
}

export default Chats;