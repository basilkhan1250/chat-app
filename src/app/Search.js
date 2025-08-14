"use client"

import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa"; // three-line icon
import { FiSettings } from "react-icons/fi"; // settings gear icon
import { useEffect, useState } from "react";

function Search() {
    return (
        <div className="bg-blue-600 w-full h-[70px] flex items-center justify-between px-4">
            <h1 className="text-3xl font-semibold text-white">Wassup</h1>

            <div className="flex items-center justify-center shadow-md">
                <form className="flex items-center">
                    <FaSearch className="text-white text-xl mr-3" />
                    <input
                        type="text"
                        placeholder="Type a name..."
                        className="w-[300px] py-2 border-b-2 border-gray-300 text-lg focus:border-white focus:outline-none text-gray-100 bg-transparent placeholder-gray-200"
                    />
                    <button className="text-blue-600 font-semibold px-6 cursor-pointer py-2 rounded-full shadow-md hover:scale-105 bg-white transition-transform duration-200">
                        Search
                    </button>
                </form>
            </div>

            <div className="cursor-pointer hover:scale-110 transition-transform duration-200">
                {/* Uncomment whichever icon you prefer */}
                {/* <FiSettings className="text-white text-2xl" /> */}
                <FaBars className="text-white text-2xl" />
            </div>
        </div>
    );
}

export default Search;
