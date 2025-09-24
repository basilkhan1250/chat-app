"use client";

import Search from "../Search";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useChat } from "../Context/ContextData";

const profile = ({ onOpenFeed, onOpenChats }) => {
    const { currentUser } = useChat();
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [editText, setEditText] = useState("");


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
    const startEdit = (p) => { setEditingPost(p); setEditText(p.text || ""); };
    const cancelEdit = () => { setEditingPost(null); setEditText(""); };



    return (
        <>
            <Search />
            <div className="pt-20">
                {/* Header to match Chats */}
                <div className="max-w-4xl mx-auto rounded-t-xl bg-slate-900/90 backdrop-blur border border-slate-800 p-4 flex items-center justify-between shadow">
                    <h1 className="text-lg font-semibold text-gray-100">Profile</h1>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={onOpenChats} className="px-4 py-2 rounded-full bg-slate-800 text-gray-100 hover:bg-slate-700 transition cursor-pointer">Messages</button>
                        <button onClick={onOpenFeed} className="px-4 py-2 rounded-full bg-slate-800 text-gray-100 hover:bg-slate-700 transition cursor-pointer">Feed</button>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-b-xl bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="mt-2 rounded-xl border border-slate-800 shadow bg-slate-900 text-gray-100 p-4 sm:p-5 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-2">My Posts</h2>
                    {posts.length === 0 ? (
                        <p className="text-slate-300">No posts yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {posts.map((p) => (
                                <li key={p.id} className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800">
                                    {editingPost && editingPost.id === p.id ? (
                                        <div className="space-y-3">
                                            <textarea
                                                className="w-full p-3 sm:p-4 border border-slate-800 bg-slate-800/60 rounded-xl overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                rows={1}
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={async () => {
                                                    try {
                                                        await updateDoc(doc(db, "users", currentUser.uid, "posts", p.id), { text: editText });
                                                        cancelEdit();
                                                    } catch (e) {
                                                        console.error("Failed to update:", e);
                                                    }
                                                }} className="px-4 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">Save</button>
                                                <button onClick={cancelEdit} className="px-4 py-1.5 bg-slate-800 text-gray-200 rounded-full hover:bg-slate-700 transition">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="whitespace-pre-wrap text-slate-100 leading-relaxed">{p.text}</div>
                                            <div className="mt-3 flex gap-4">
                                                <button onClick={() => startEdit(p)} className="text-blue-400 hover:text-blue-300 transition">Edit</button>
                                                <button onClick={async () => {
                                                    try { await deleteDoc(doc(db, "users", currentUser.uid, "posts", p.id)); } catch (e) { console.error("Failed to delete:", e); }
                                                }} className="text-red-400 hover:text-red-300 transition">Delete</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                </div>
            </div>
        </>
    )
}

export default profile;