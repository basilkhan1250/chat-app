"use client"
import React, { useState } from "react";


const Chats = () => {






    return (
        <>



            <div className="chats h-screen flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
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
                <form
                    onSubmit={sendMessage}
                    className="fixed bottom-0 left-0 w-full bg-white p-2 border-t border-gray-300 flex items-center"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="ml-2 px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}

export default Chats;
