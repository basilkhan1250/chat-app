"use client";

import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../utils/firebaseConfig";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [contact, setContact] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(res.user, { displayName });

                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    email,
                    displayName,
                    contactNumber: contact.trim(),
                });
            }
        } catch (error) {
            console.error("Auth error:", error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
            <form
                onSubmit={handleSubmit}
                className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                {!isLogin && (
                    <>
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full mb-4 p-3 border rounded-lg focus:ring focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            className="w-full mb-4 p-3 border rounded-lg focus:ring focus:ring-blue-400"
                        />
                    </>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mb-4 p-3 border rounded-lg focus:ring focus:ring-blue-400"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mb-6 p-3 border rounded-lg focus:ring focus:ring-blue-400"
                />

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                <p className="mt-6 text-center text-gray-600">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        className="text-blue-600 font-semibold cursor-pointer underline"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </form>
        </div>
    );
}
