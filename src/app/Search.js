"use client";

import { FaSearch, FaBars, FaUserPlus } from "react-icons/fa";
import { useRef, useState } from "react";
import { useChat } from "./Context/ContextData";
import { getAuth, signOut } from "firebase/auth";
import AddContact from "./components/AddContact";

function Search({ onSelect, selected }) {
    console.log(selected);
    const { contacts } = useChat();
    const searchUser = useRef(null);
    const [showAddContact, setShowAddContact] = useState(false);
    const [selectedUsername, setSelectedUserName] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(contacts)
        const userInput = searchUser.current.value.trim();
        console.log(userInput)
        const found = contacts.find(
            (p) => p.displayName.toLowerCase() === userInput.toLowerCase()
        );
        console.log(found)

        if (found) {
            console.log(found.displayName)
            setSelectedUserName(found.displayName);
        } else {
            alert("User not found!");
        }

        searchUser.current.value = "";
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            alert("Logged out successfully!");
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    return (
        <div className="bg-blue-900 w-full h-[70px] flex items-center justify-between px-4 fixed top-0 left-0 z-50">
            {/* Logo / Reset Chat */}
            <h1
                onClick={() => onSelect(null)}
                // onClick={() => setSelectedUserName(null)}
                className="text-3xl font-semibold text-white cursor-pointer"
            >
                Wassup
            </h1>

            {/* Search Box */}
            <div className="flex items-center justify-center shadow-md">
                <form className="flex items-center" onSubmit={handleSearch}>
                    <FaSearch className="text-white text-xl mr-3" />
                    <input
                        ref={searchUser}
                        type="text"
                        placeholder="Type a name..."
                        className="w-[300px] py-2 border-b-2 border-gray-300 text-lg 
                            focus:border-white focus:outline-none text-gray-100 
                            bg-transparent placeholder-gray-200"
                    />
                    <button
                        type="submit"
                        className="text-blue-600 font-semibold px-6 cursor-pointer py-2 rounded-full shadow-md hover:scale-105 bg-white transition-transform duration-200"
                    >
                        Search
                    </button>

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="ml-3 text-white font-semibold px-6 cursor-pointer py-2 rounded-full shadow-md hover:scale-105 bg-red-600 transition-transform duration-200"
                    >
                        Logout
                    </button>
                </form>
            </div>

            {/* Icons: Add Contact + Menu */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="cursor-pointer hover:scale-110 transition-transform duration-200"
                >
                    <FaUserPlus className="text-white text-2xl" />
                </button>
            </div>

            {/* Add Contact Modal/Component */}
            {showAddContact && (
                <div className="absolute top-[80px] right-4 bg-white shadow-lg p-4 rounded-lg w-[300px]">
                    <AddContact />
                </div>
            )}
        </div>
    );
}

export default Search;
