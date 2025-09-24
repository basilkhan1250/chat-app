"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur p-6 sm:p-8 shadow"
            >
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-100">
                    {isLogin ? "Welcome back" : "Create account"}
                </h2>

                {!isLogin && (
                    <>
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full mb-4 p-3 rounded-xl border border-slate-800 bg-slate-800/60 text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            className="w-full mb-4 p-3 rounded-xl border border-slate-800 bg-slate-800/60 text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                    </>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mb-4 p-3 rounded-xl border border-slate-800 bg-slate-800/60 text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mb-6 p-3 rounded-xl border border-slate-800 bg-slate-800/60 text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />

                <button
                    type="submit"
                    className="w-full px-5 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-500 transition cursor-pointer"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                <p className="mt-6 text-center text-slate-300 text-sm sm:text-base">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </form>
        </div>
    );
}
