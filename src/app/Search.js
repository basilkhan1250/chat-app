"use client";

import { FaSearch, FaBars } from "react-icons/fa";
import { useRef } from "react";
import { usePeople } from "./Context/ContextData";

function Search() {
    const { people, setSelectedUserName } = usePeople();
    const searchUser = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const userInput = searchUser.current.value.trim();
        const found = people.find(
            (p) => p.name.toLowerCase() === userInput.toLowerCase()
        );

        if (found) {
            setSelectedUserName(found.name); // ✅ switch chat
        } else {
            alert("User not found!");
        }

        searchUser.current.value = "";
    };

    return (
        <div className="bg-blue-900 w-full h-[70px] flex items-center justify-between px-4 fixed top-0 left-0 z-50">
            <h1 onClick={() => setSelectedUserName(null)} className="text-3xl font-semibold text-white cursor-pointer">Wassup</h1>

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
                    <button className="text-blue-600 font-semibold px-6 cursor-pointer py-2 rounded-full shadow-md hover:scale-105 bg-white transition-transform duration-200">
                        Search
                    </button>
                </form>
            </div>

            <div className="cursor-pointer hover:scale-110 transition-transform duration-200">
                <FaBars className="text-white text-2xl" />
            </div>
        </div>
    );
}

export default Search;
