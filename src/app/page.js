"use client";

import Search from "./Search";
import Auth from "./components/Auth";
import Chats from "./Chats";
import { useChat } from "./Context/ContextData";
import { useState } from "react";
import FeedPage from "./components/FeedPage";
import Profile from "./components/profile";

export default function Home() {
  const { currentUser, loading } = useChat();
  const [showChats, setShowChats] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="w-full h-screen bg-gray-100">
      {showProfile ? (
        <Profile onOpenFeed={() => setShowProfile(false)} onOpenChats={() => { setShowProfile(false); setShowChats(true); }} />
      ) : showChats ? (
        <Chats onClose={() => setShowChats(false)} />
      ) : (
        <FeedPage onOpenChats={() => setShowChats(true)} onOpenProfile={() => setShowProfile(true)} />
      )}
    </div>
  );
}
