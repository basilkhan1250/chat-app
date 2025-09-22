import Chats from "../Chats";
import Search from "../Search";

const FeedPage = ({ onOpenChats }) => {

    const feed = [
        { id: 1, user: 'Alice', message: 'Hello, world!', timestamp: '2024-06-01 10:00' },
        { id: 2, user: 'Bob', message: 'Hi Alice!', timestamp: '2024-06-01 10:05' },
        { id: 3, user: 'Charlie', message: 'Good morning everyone!', timestamp: '2024-06-01 10:10' },
    ]

    return (
        <>
            <Search />
            <div className="pt-20">
                <h2>Feed</h2>
                <div>
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
            <div className="message-box">
                <button onClick={onOpenChats} className="w-[200px] cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition">Messages</button>
            </div>
        </>

    );
};

export default FeedPage;