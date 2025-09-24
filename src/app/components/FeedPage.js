import Chats from "../Chats";
import Search from "../Search";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useChat } from "../Context/ContextData";

const FeedPage = ({ onOpenChats, onOpenProfile }) => {
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);
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



    return (
        <>
            <Search />
            <div className="pt-20">
                <div className="flex items-center justify-center gap-4">
                    <div className="message-box">
                        <button onClick={onOpenChats} className="w-[200px] cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition">Messages</button>
                    </div>
                    <div className="profile">
                        <button onClick={onOpenProfile} className="w-[200px] cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition">Profile</button>
                    </div>
                </div>

                <div className="create-post mt-2 border rounded-lg shadow-md bg-white p-2">
                    <h1 className="text-[24px] font-semibold">Create Post</h1>
                    <textarea
                        rows={1}
                        value={text}
                        onChange={handleChange}
                        onInput={autoGrow}
                        placeholder="What's on your mind?"
                        className="w-full p-2 border rounded-lg mb-2 overflow-hidden resize-none"
                    />
                    <button
                        onClick={handlePost}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
                    >
                        Post
                    </button>
                </div>


                <div className="feed mt-6 border rounded-lg shadow-md bg-white">
                    {posts.length === 0 ? (
                        <p className="py-3 px-4">No posts yet.</p>
                    ) : (
                        posts.map((item) => (
                            <div className="py-2 px-4" key={`${item.ownerId}-${item.id}`} style={{ borderBottom: '1px solid #d4d1d1ff' }}>
                                <div className="whitespace-pre-wrap">{item.text}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default FeedPage;