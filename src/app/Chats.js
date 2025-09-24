"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import ContactsList from "./components/ContactsLists";
import { useChat } from "./Context/ContextData";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import Search from "./Search";
import bgImage from "./assets/bgImageSpiderLogo.jpg";

const Chats = ({ onClose }) => {
  const { currentUser } = useChat();
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatHistories, setChatHistories] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null); // ✅ track editing message
  const [menuOpen, setMenuOpen] = useState(null); // ✅ track which menu is open
  const messagesEndRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const isResizing = useRef(false);

  const startResizing = () => (isResizing.current = true);
  const stopResizing = () => (isResizing.current = false);

  const handleMouseMove = (e) => {
    if (isResizing.current) {
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const getChatId = (uid1, uid2) => {
    if (!uid1 || !uid2) return null;
    return uid1.localeCompare(uid2) < 0 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || !currentUser) return;
    const chatId = getChatId(currentUser.uid, selectedContact.id);
    if (!chatId) return;

    try {
      if (editingMessage) {
        // ✅ update existing message
        await updateDoc(
          doc(db, "chats", chatId, "messages", editingMessage.id),
          { text: newMessage }
        );
        setEditingMessage(null);
      } else {
        // ✅ send new message
        await addDoc(collection(db, "chats", chatId, "messages"), {
          text: newMessage,
          senderId: currentUser.uid,
          senderName: currentUser.displayName || "Me",
          timestamp: serverTimestamp(),
        });

        await setDoc(
          doc(db, "users", currentUser.uid, "contacts", selectedContact.id),
          {
            id: selectedContact.id,
            displayName:
              selectedContact.displayName ||
              selectedContact.userName ||
              "Contact",
            lastMessage: newMessage,
            lastMessageTime: serverTimestamp(),
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "users", selectedContact.id, "contacts", currentUser.uid),
          {
            id: currentUser.uid,
            displayName: currentUser.displayName || "Me",
            lastMessage: newMessage,
            lastMessageTime: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const deleteMessage = async (msgId) => {
    if (!selectedContact) return;
    const chatId = getChatId(currentUser.uid, selectedContact.id);
    try {
      await deleteDoc(doc(db, "chats", chatId, "messages", msgId));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const editMessage = (msg) => {
    setNewMessage(msg.text);
    setEditingMessage(msg);
  };

  useEffect(() => {
    if (!selectedContact || !currentUser) return;
    const chatId = getChatId(currentUser.uid, selectedContact.id);
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatHistories((prev) => ({
        ...prev,
        [selectedContact.id]: msgs,
      }));
    });
    return () => unsub();
  }, [selectedContact, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistories, selectedContact]);

  return (
    <>
      <Search onSelect={setSelectedContact} selected={selectedContact} />
      <div className="fixed top-[70px] right-0 h-[92vh] w-full flex bg-gray-100">
        {/* Sidebar */}
        <div
          className={`${isMobile ? (showChat ? "hidden" : "block") : "block"} 
                      bg-gray-900 text-white overflow-y-auto border-r border-gray-800`}
          style={{ width: isMobile ? "100%" : sidebarWidth }}
        >
          <h1 className="p-4 font-bold text-2xl border-b border-gray-700 bg-gray-800">
            {currentUser?.displayName || "Chats"}
          </h1>
          <ContactsList
            onSelect={(c) => {
              setSelectedContact(c);
              if (isMobile) setShowChat(true);
            }}
            selected={selectedContact}
          />
        </div>

        {/* Drag Handle */}
        <div
          onMouseDown={startResizing}
          className="hidden md:block w-1 bg-gray-600 cursor-col-resize hover:bg-gray-500"
        ></div>

        {/* Chat Window */}
        {/* Chat Window */}
        <div
          className={`${isMobile ? (showChat ? "flex" : "hidden") : "flex"
            } flex-1 flex-col bg-gradient-to-br from-gray-100 to-gray-200`}
        >
          {/* Navbar */}
          <div className="bg-slate-800 border-b border-gray-300 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              {isMobile && showChat && (
                <button
                  className="text-white mr-3 cursor-pointer"
                  onClick={() => setShowChat(false)}
                >
                  ←
                </button>
              )}
              {selectedContact?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedContact.photoURL} alt="Profile" width={40} height={40} className="rounded-full border object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 border" />
              )}
              <h2 className="text-lg font-semibold text-gray-100">
                {selectedContact?.displayName ||
                  selectedContact?.userName ||
                  "Start the chat"}
              </h2>
            </div>

            {/* Back button (top right) */}
            <button
              onClick={onClose}
              className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600 transition"
            >
              Back
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 p-4 overflow-y-auto"
            style={{
              backgroundImage: `url(${bgImage.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {selectedContact &&
              chatHistories[selectedContact.id]?.map((msg) => (
                <div
                  key={msg.id}
                  className={`group mb-3 flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`relative max-w-xs px-4 py-2 rounded-2xl shadow-md text-sm ${msg.senderId === currentUser.uid
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                      }`}
                  >
                    {msg.text}

                    {/* 3-dot button on hover */}
                    {msg.senderId === currentUser.uid && (
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={() =>
                            setMenuOpen(menuOpen === msg.id ? null : msg.id)
                          }
                          className="opacity-0 group-hover:opacity-100 transition text-white text-xs"
                        >
                          ⋮
                        </button>
                        {menuOpen === msg.id && (
                          <div className="absolute right-0 mt-1 bg-white text-black rounded shadow-md z-10">
                            <button
                              onClick={() => {
                                editMessage(msg);
                                setMenuOpen(null);
                              }}
                              className="block px-4 py-2 hover:bg-gray-200 text-sm w-full text-left"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                deleteMessage(msg.id);
                                setMenuOpen(null);
                              }}
                              className="block px-4 py-2 hover:bg-red-200 text-sm w-full text-left text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {selectedContact && (
            <form
              onSubmit={sendMessage}
              className="bg-slate-800 p-3 border-t border-gray-300 flex items-center gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-full border border-gray-100 
                   focus:ring focus:ring-blue-400 
                   text-white placeholder-white bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition cursor-pointer"
              >
                {editingMessage ? "Update" : "Send"}
              </button>
            </form>
          )}
        </div>

      </div>

    </>
  );
};

export default Chats;
