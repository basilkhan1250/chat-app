import Chats from "../Chats";
import Search from "../Search";
import { useRef, useState } from "react";

const FeedPage = ({ onOpenChats }) => {
    const [text, setText] = useState("");


    const feed = [
        { id: 1, user: 'Alice', message: 'Hello, world!', timestamp: '2024-06-01 10:00' },
        { id: 2, user: 'Bob', message: 'Hi Alice!', timestamp: '2024-06-01 10:05' },
        { id: 3, user: 'Charlie', message: 'Good morning everyone!', timestamp: '2024-06-01 10:10' },
    ]


    const autoGrow = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto"; // reset height
        textarea.style.height = textarea.scrollHeight + "px"; // set to scroll height
    };



    const handleChange = (e) => {
        setText(e.target.value);
        console.log(text);

        // textareaRef.current.value = "";
        // textareaRef.current.style.height = "auto"; 
    };



    return (
        <>
            <Search />
            <div className="pt-20">
                <div className="message-box">
                    <button onClick={onOpenChats} className="w-[200px] cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition">Messages</button>
                </div>

                <div className="create-post mt-2 border rounded-lg shadow-md bg-white p-2">
                    <h1 className="text-[24px] font-semibold">Create Post</h1>
                    <input
                        type="text"
                        value={text}
                        onChange={handleChange}
                        placeholder="What's on your mind?"
                        className="w-full p-2 border rounded-lg mb-2"
                    />
                    <button
                        onClick={handleChange}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
                    >
                        Post
                    </button>
                </div>


                <div className="feed mt-6 border rounded-lg shadow-md bg-white">
                    {feed.length === 0 ? (
                        <p>No messages yet.</p>
                    ) : (
                        feed.map(item => (
                            <div className="py-2 px-4" key={item.id} style={{ borderBottom: '1px solid #d4d1d1ff' }}>
                                <strong>{item.user}</strong> <span style={{ color: '#888' }}>{item.timestamp}</span>
                                <div>{item.message}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>

    );
};

export default FeedPage;