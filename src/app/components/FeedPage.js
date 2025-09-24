import Chats from "../Chats";
import Search from "../Search";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useChat } from "../Context/ContextData";

const FeedPage = ({ onOpenChats, onOpenProfile }) => {
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null); // { id, ownerId, text }
    const [editText, setEditText] = useState("");
    const { currentUser, contacts } = useChat();


    // Realtime aggregate feed of current user + contacts
    useEffect(() => {
        if (!currentUser) return;
        const contactUids = (contacts || []).map((c) => c.uid || c.id).filter(Boolean);
        const uniqueUids = Array.from(new Set(contactUids));

        if (uniqueUids.length === 0) {
            setPosts([]);
            return;
        }

        const perUserPosts = new Map();
        const unsubs = uniqueUids.map((uid) => {
            const q = query(collection(db, "users", uid, "posts"), orderBy("createdAt", "desc"));
            return onSnapshot(q, (snap) => {
                const list = snap.docs.map((d) => ({ id: d.id, ownerId: uid, ...d.data() }));
                perUserPosts.set(uid, list);
                // merge all lists and sort desc by createdAt
                const merged = Array.from(perUserPosts.values()).flat();
                merged.sort((a, b) => {
                    const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                    const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                    return tb - ta;
                });
                setPosts(merged);
            });
        });

        return () => {
            unsubs.forEach((u) => u && u());
        };
    }, [currentUser, contacts]);


    const autoGrow = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto"; // reset height
        textarea.style.height = textarea.scrollHeight + "px"; // set to scroll height
    };



    const handleChange = (e) => {
        setText(e.target.value);
        autoGrow(e);
        console.log(e.target.value)
        // console.log(text)
    };

    const handlePost = async () => {
        if (!currentUser || !text.trim()) return;
        try {
            await addDoc(collection(db, "users", currentUser.uid, "posts"), {
                text: text.trim(),
                ownerId: currentUser.uid,
                createdAt: serverTimestamp(),
            });
            setText("");
        } catch (error) {
            console.error("Failed to post:", error);
        }
    };

    const startEdit = (item) => {
        setEditingPost({ id: item.id, ownerId: item.ownerId });
        setEditText(item.text || "");
    };

    const cancelEdit = () => {
        setEditingPost(null);
        setEditText("");
    };

    const saveEdit = async () => {
        if (!editingPost) return;
        const { id, ownerId } = editingPost;
        try {
            await updateDoc(doc(db, "users", ownerId, "posts", id), { text: editText });
            cancelEdit();
        } catch (e) {
            console.error("Failed to update post:", e);
        }
    };

    const deletePost = async (item) => {
        try {
            await deleteDoc(doc(db, "users", item.ownerId, "posts", item.id));
        } catch (e) {
            console.error("Failed to delete post:", e);
        }
    };



    return (
        <>
            <Search />
            <div className="pt-20">
                {/* Header to match Chats */}
                <div className="max-w-4xl mx-auto rounded-t-xl bg-slate-900/90 backdrop-blur border border-slate-800 p-4 flex items-center justify-between shadow">
                    <h1 className="text-lg font-semibold text-gray-100">Feed</h1>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={onOpenChats} className="px-4 py-2 rounded-full bg-slate-800 text-gray-100 hover:bg-slate-700 transition cursor-pointer">Messages</button>
                        <button onClick={onOpenProfile} className="px-4 py-2 rounded-full bg-slate-800 text-gray-100 hover:bg-slate-700 transition cursor-pointer">Profile</button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-b-xl bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="create-post rounded-xl border border-slate-800 shadow bg-slate-900 p-3 sm:p-4 text-gray-100">
                    <h1 className="text-[18px] sm:text-[20px] font-semibold mb-2">Create Post</h1>
                    <textarea
                        rows={1}
                        value={text}
                        onChange={handleChange}
                        onInput={autoGrow}
                        placeholder="What's on your mind?"
                        className="w-full p-3 sm:p-4 border border-slate-800 bg-slate-800/60 rounded-xl mb-3 overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-400"
                    />
                    <div className="flex items-center justify-end">
                        <button
                            onClick={handlePost}
                            className="px-5 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition cursor-pointer"
                        >
                            Post
                        </button>
                    </div>
                </div>

                <div className="feed mt-6 space-y-3">
                    {posts.length === 0 ? (
                        <p className="py-6 px-4 text-center text-slate-300 bg-slate-900/60 rounded-xl border border-slate-800">No posts yet.</p>
                    ) : (
                        posts.map((item) => (
                            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow" key={`${item.ownerId}-${item.id}`}>
                                {editingPost && editingPost.id === item.id && editingPost.ownerId === item.ownerId ? (
                                    <div className="space-y-3">
                                        <textarea
                                            className="w-full p-3 sm:p-4 border border-slate-800 bg-slate-800/60 rounded-xl overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                            rows={1}
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={saveEdit} className="px-4 py-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">Save</button>
                                            <button onClick={cancelEdit} className="px-4 py-1.5 bg-slate-800 text-gray-200 rounded-full hover:bg-slate-700 transition">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="whitespace-pre-wrap text-slate-100 leading-relaxed">{item.text}</div>
                                        {currentUser && item.ownerId === currentUser.uid && (
                                            <div className="mt-3 flex gap-4">
                                                <button onClick={() => startEdit(item)} className="text-blue-400 hover:text-blue-300 transition">Edit</button>
                                                <button onClick={() => deletePost(item)} className="text-red-400 hover:text-red-300 transition">Delete</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default FeedPage;