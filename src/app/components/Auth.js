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
                // ✅ Login user
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // ✅ Sign up user
                const res = await createUserWithEmailAndPassword(auth, email, password);

                // ✅ Set displayName on Firebase Auth user
                await updateProfile(res.user, { displayName });

                // ✅ Save user in Firestore
                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    email,
                    displayName,
                    contactNumber: contact.trim(), // 👈 string
                });
            }
        } catch (error) {
            console.error("Auth error:", error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>

                {!isLogin && (
                    <>
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            className="w-full mb-4 p-2 border rounded"
                        />
                    </>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mb-4 p-2 border rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mb-4 p-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 cursor-pointer rounded hover:bg-blue-600"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                <p className="mt-4 text-center">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        className="text-blue-500 cursor-pointer underline"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </form>
        </div>
    );
}
