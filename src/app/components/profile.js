"use client";

import Search from "../Search";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useChat } from "../Context/ContextData";

const profile = ({ onOpenFeed, onOpenChats }) => {
    const { currentUser } = useChat();
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        if (!currentUser) return;
        const q = query(
            collection(db, "users", currentUser.uid, "posts"),
            orderBy("createdAt", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setPosts(list);
        });
        return () => unsub();
    }, [currentUser]);



    return (
        <>
            <Search />
            <div className="pt-20">
                <div className="flex items-center justify-center gap-4">
                    <div className="message-box">
                        <button onClick={onOpenChats} className="w-[200px] cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition">Messages</button>
                    </div>
                    <div className="profile">
                        <button onClick={onOpenFeed} className="w-[200px] cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition">FeedPage</button>
                    </div>
                </div>
                <h1 className="text-2xl font-bold">Profile</h1>
                <div className="mt-4 border rounded-lg shadow-md bg-white p-4 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-2">My Posts</h2>
                    {posts.length === 0 ? (
                        <p className="text-gray-500">No posts yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {posts.map((p) => (
                                <li key={p.id} className="p-3 border rounded">
                                    <div className="whitespace-pre-wrap">{p.text}</div>
                                    {/* createdAt may be null before serverTimestamp resolves */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}

export default profile;