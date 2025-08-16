"use client";

import { createContext, useContext, useState } from "react";
import pfp from "@/app/assets/basil.jpeg";

const ContextData = createContext();

export const ContextProvider = ({ children }) => {
    const [people] = useState([
        { name: "Rin", img: pfp },
        { name: "Alex", img: pfp },
        { name: "Maya", img: pfp },
        { name: "Ninja", img: pfp },
    ]);

    // shared state for selected user
    const [selectedUserName, setSelectedUserName] = useState(null);

    return (
        <ContextData.Provider value={{ people, selectedUserName, setSelectedUserName }}>
            {children}
        </ContextData.Provider>
    );
};

export const usePeople = () => useContext(ContextData);
